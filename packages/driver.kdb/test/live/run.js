const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const KdbDriver = require('../../out/ls/driver').default;
const { ContextValue } = require('@sqltools/types');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const FIXTURE = path.join(__dirname, 'fixture.q');

(async () => {
  const qPath = resolveQPath();
  if (!qPath) {
    const message = 'No q binary found. Set KDB_Q_BIN=/path/to/q to run live kdb+/q tests.';
    if (process.env.KDB_SQLTOOLS_LIVE_REQUIRED === '1') {
      throw new Error(message);
    }
    console.log(`Skipping live kdb+/q test: ${message}`);
    return;
  }

  const port = await getFreePort();
  const q = startQ(qPath, port);

  try {
    await waitForQ(port, 15000);
    await runLiveAssertions(port);
    console.log(`Live kdb+/q test passed using ${qPath}`);
  } finally {
    await stopQ(q);
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});

async function runLiveAssertions(port) {
  const driver = createDriver(port);

  try {
    await driver.testConnection();

    const trade = await driver.query('select sym,size,price from trade where sym in `AAPL`MSFT');
    assert.strictEqual(trade.length, 1);
    assert.strictEqual(trade[0].error, undefined);
    assert.deepStrictEqual(trade[0].cols, ['sym', 'size', 'price']);
    assert.deepStrictEqual(trade[0].results, [
      { sym: 'AAPL', size: 100, price: 123.45 },
      { sym: 'MSFT', size: 250, price: 234.56 },
    ]);

    const scalar = await driver.query('calcSpread[123.40;123.50]');
    assert.strictEqual(scalar[0].error, undefined);
    assert.deepStrictEqual(scalar[0].cols, ['value']);
    assert.strictEqual(Number(scalar[0].results[0].value.toFixed(2)), 0.10);

    const keyed = await driver.query('quote');
    assert.strictEqual(keyed[0].error, undefined);
    assert.deepStrictEqual(keyed[0].cols, ['sym', 'bid', 'ask']);
    assert.deepStrictEqual(keyed[0].results, [
      { sym: 'AAPL', bid: 123.40, ask: 123.50 },
      { sym: 'MSFT', bid: 234.50, ask: 234.60 },
    ]);

    const empty = await driver.query('empty');
    assert.strictEqual(empty[0].error, undefined);
    assert.deepStrictEqual(empty[0].cols, ['sym', 'size']);
    assert.deepStrictEqual(empty[0].results, []);

    const edge = await driver.query('select sym,chars,nums,nested,dict,nullSym,longid,day,ts,span from edge');
    assert.strictEqual(edge[0].error, undefined);
    assert.deepStrictEqual(edge[0].cols, ['sym', 'chars', 'nums', 'nested', 'dict', 'nullSym', 'longid', 'day', 'ts', 'span']);
    assert.deepStrictEqual(edge[0].results, [{
      sym: 'AAPL',
      chars: 'alpha',
      nums: '[1,2,3]',
      nested: '["left","right"]',
      dict: '{"a":10,"b":20}',
      nullSym: null,
      longid: '9007199254740993',
      day: '2024-01-02',
      ts: '2024-01-02T09:30:00.123Z',
      span: '00:00:00.123456789',
    }]);

    const connectionItem = {
      label: 'live q',
      type: ContextValue.CONNECTION,
      database: '.',
      schema: '.',
    };
    const groups = await driver.getChildrenForItem({ item: connectionItem });
    const tablesGroup = groups.find(item => item.label === 'Tables');
    const viewsGroup = groups.find(item => item.label === 'Views');
    const functionsGroup = groups.find(item => item.label === 'Functions');
    assert.ok(tablesGroup, 'expected Tables explorer group');
    assert.ok(viewsGroup, 'expected Views explorer group');
    assert.ok(functionsGroup, 'expected Functions explorer group');

    const tables = await driver.getChildrenForItem({ item: tablesGroup, parent: connectionItem });
    const labels = tables.map(item => item.label).sort();
    assert.ok(labels.includes('trade'), `expected trade table in ${labels.join(', ')}`);
    assert.ok(labels.includes('quote'), `expected quote table in ${labels.join(', ')}`);
    assert.ok(labels.includes('empty'), `expected empty table in ${labels.join(', ')}`);
    assert.ok(labels.includes('edge'), `expected edge table in ${labels.join(', ')}`);
    assert.ok(labels.includes('attrTrade'), `expected attrTrade table in ${labels.join(', ')}`);

    const tradeItem = tables.find(item => item.label === 'trade');
    assert.ok(tradeItem, 'expected trade table item');
    const columnGroups = await driver.getChildrenForItem({ item: tradeItem, parent: tablesGroup });
    const columns = await driver.getChildrenForItem({ item: columnGroups[0], parent: tradeItem });
    const columnTypes = Object.fromEntries(columns.map(column => [column.label, column.dataType]));
    assert.deepStrictEqual(
      { sym: columnTypes.sym, size: columnTypes.size, price: columnTypes.price, day: columnTypes.day, ts: columnTypes.ts },
      { sym: 'symbol', size: 'int', price: 'float', day: 'date', ts: 'timestamp' }
    );

    const emptyItem = tables.find(item => item.label === 'empty');
    assert.ok(emptyItem, 'expected empty table item');
    const emptyColumnGroups = await driver.getChildrenForItem({ item: emptyItem, parent: tablesGroup });
    const emptyColumns = await driver.getChildrenForItem({ item: emptyColumnGroups[0], parent: emptyItem });
    assert.deepStrictEqual(
      Object.fromEntries(emptyColumns.map(column => [column.label, column.dataType])),
      { sym: 'symbol', size: 'int' }
    );
    assert.strictEqual(
      simulateSqlToolsFormatInsertQuery(await driver.getInsertQuery({ item: emptyItem, columns: emptyColumns })),
      '(`$"empty") insert (`; 0Ni);'
    );

    const edgeItem = tables.find(item => item.label === 'edge');
    assert.ok(edgeItem, 'expected edge table item');
    const edgeColumnGroups = await driver.getChildrenForItem({ item: edgeItem, parent: tablesGroup });
    const edgeColumns = await driver.getChildrenForItem({ item: edgeColumnGroups[0], parent: edgeItem });
    const edgeColumnTypes = Object.fromEntries(edgeColumns.map(column => [column.label, column.dataType]));
    assert.deepStrictEqual(
      { chars: edgeColumnTypes.chars, nums: edgeColumnTypes.nums, nested: edgeColumnTypes.nested, dict: edgeColumnTypes.dict },
      { chars: 'char list', nums: 'long list', nested: 'mixed', dict: 'mixed' }
    );
    assert.strictEqual(
      simulateSqlToolsFormatInsertQuery(await driver.getInsertQuery({ item: edgeItem, columns: edgeColumns })),
      '(`$"edge") insert (`; ::; ::; ::; ::; `; 0Nj; .z.D; .z.P; 00:00:00.000000000);'
    );

    const attrItem = tables.find(item => item.label === 'attrTrade');
    assert.ok(attrItem, 'expected attrTrade table item');
    const attrColumnGroups = await driver.getChildrenForItem({ item: attrItem, parent: tablesGroup });
    const attrColumns = await driver.getChildrenForItem({ item: attrColumnGroups[0], parent: attrItem });
    const attrSym = attrColumns.find(column => column.label === 'sym');
    assert.ok(attrSym, 'expected attrTrade sym column');
    assert.strictEqual(attrSym.dataType, 'symbol');
    assert.ok(attrSym.detail.includes('attr s'), `expected sorted attribute detail, got ${attrSym.detail}`);

    const preview = await driver.queries.fetchRecords({ namespace: '.', table: { label: 'trade' }, limit: 2, offset: 1 }).toString();
    const previewResult = await driver.query(preview);
    assert.strictEqual(previewResult[0].results.length, 2);
    assert.deepStrictEqual(previewResult[0].results.map(row => row.sym), ['MSFT', 'GOOG']);

    const quoteItem = tables.find(item => item.label === 'quote');
    assert.ok(quoteItem, 'expected quote keyed table item');
    const quoteColumnGroups = await driver.getChildrenForItem({ item: quoteItem, parent: tablesGroup });
    const quoteColumns = await driver.getChildrenForItem({ item: quoteColumnGroups[0], parent: quoteItem });
    assert.deepStrictEqual(
      Object.fromEntries(quoteColumns.map(column => [column.label, column.dataType])),
      { sym: 'symbol', bid: 'float', ask: 'float' }
    );
    assert.strictEqual(
      simulateSqlToolsFormatInsertQuery(await driver.getInsertQuery({ item: quoteItem, columns: quoteColumns })),
      '(`$"quote") insert (`; 0n; 0n);'
    );
    const keyedPreview = await driver.query(
      driver.queries.fetchRecords({ namespace: '.', table: quoteItem, limit: 2, offset: 0 }).toString()
    );
    assert.strictEqual(keyedPreview[0].error, undefined);
    assert.deepStrictEqual(keyedPreview[0].cols, ['sym', 'bid', 'ask']);
    assert.deepStrictEqual(keyedPreview[0].results.map(row => row.sym), ['AAPL', 'MSFT']);

    const nonRootPreview = await driver.showRecords(
      {
        label: 'nsTrade',
        type: ContextValue.TABLE,
        schema: '.analytics',
        database: '.analytics',
        isView: false,
      },
      { limit: 1, page: 1 }
    );
    assert.strictEqual(nonRootPreview[0].error, undefined);
    assert.strictEqual(nonRootPreview[0].total, 2);
    assert.deepStrictEqual(nonRootPreview[0].results, [{ sym: 'ORCL', size: 20 }]);

    const analyticsConnectionItem = {
      label: 'analytics',
      type: ContextValue.CONNECTION,
      database: '.analytics',
      schema: '.analytics',
    };
    const analyticsGroups = await driver.getChildrenForItem({ item: analyticsConnectionItem });
    const analyticsTablesGroup = analyticsGroups.find(item => item.label === 'Tables');
    const analyticsFunctionsGroup = analyticsGroups.find(item => item.label === 'Functions');
    assert.ok(analyticsTablesGroup, 'expected analytics Tables explorer group');
    assert.ok(analyticsFunctionsGroup, 'expected analytics Functions explorer group');

    const analyticsTables = await driver.getChildrenForItem({ item: analyticsTablesGroup, parent: analyticsConnectionItem });
    assert.deepStrictEqual(analyticsTables.map(item => item.label), ['nsTrade']);
    const analyticsFunctions = await driver.getChildrenForItem({ item: analyticsFunctionsGroup, parent: analyticsConnectionItem });
    const nsFunction = analyticsFunctions.find(item => item.label === 'nsFunc');
    assert.ok(nsFunction, `expected nsFunc function in ${analyticsFunctions.map(item => item.label).join(', ')}`);
    const nsFunctionDefinition = await driver.query(
      await driver.getDefinitionForItem({ item: nsFunction })
    );
    assert.strictEqual(nsFunctionDefinition[0].error, undefined);
    assert.ok(String(nsFunctionDefinition[0].results[0].value).includes('x+1'));

    const views = await driver.getChildrenForItem({ item: viewsGroup, parent: connectionItem });
    const viewLabels = views.map(item => item.label).sort();
    assert.ok(viewLabels.includes('tradeView'), `expected tradeView view in ${viewLabels.join(', ')}`);
    const tradeViewItem = views.find(item => item.label === 'tradeView');
    const viewColumnGroups = await driver.getChildrenForItem({ item: tradeViewItem, parent: viewsGroup });
    const viewColumns = await driver.getChildrenForItem({ item: viewColumnGroups[0], parent: tradeViewItem });
    assert.ok(viewColumns.some(column => column.label === 'sym' && column.dataType === 'symbol'));
    const viewPreview = await driver.query(
      driver.queries.fetchRecords({ namespace: '.', table: tradeViewItem, limit: 5, offset: 0 }).toString()
    );
    assert.strictEqual(viewPreview[0].error, undefined);
    assert.deepStrictEqual(viewPreview[0].results.map(row => row.sym), ['MSFT']);

    const functions = await driver.getChildrenForItem({ item: functionsGroup, parent: connectionItem });
    const calcFunction = functions.find(item => item.label === 'calcSpread');
    assert.ok(calcFunction, `expected calcSpread function in ${functions.map(item => item.label).join(', ')}`);
    const functionDefinition = await driver.query(
      await driver.getDefinitionForItem({ item: calcFunction })
    );
    assert.strictEqual(functionDefinition[0].error, undefined);
    assert.ok(String(functionDefinition[0].results[0].value).includes('ask-bid'));

    const tableDefinition = await driver.query(
      await driver.getDefinitionForItem({ item: tradeItem })
    );
    assert.strictEqual(tableDefinition[0].error, undefined);
    assert.ok(tableDefinition[0].results.some(row => row.c === 'sym'));

    const viewDefinition = await driver.query(
      await driver.getDefinitionForItem({ item: tradeViewItem })
    );
    assert.strictEqual(viewDefinition[0].error, undefined);
    assert.ok(viewDefinition[0].results.some(row => row.c === 'sym'));

    const missingNamespaceTables = await driver.query(
      driver.queries.fetchTables({ namespace: '.missing' }).toString()
    );
    assert.strictEqual(missingNamespaceTables[0].error, undefined);
    assert.deepStrictEqual(missingNamespaceTables[0].results, []);

    const missingNamespaceViews = await driver.query(
      driver.queries.fetchViews({ namespace: '.missing' }).toString()
    );
    assert.strictEqual(missingNamespaceViews[0].error, undefined);
    assert.deepStrictEqual(missingNamespaceViews[0].results, []);

    const missingNamespaceFunctions = await driver.query(
      driver.queries.fetchFunctions({ namespace: '.missing' }).toString()
    );
    assert.strictEqual(missingNamespaceFunctions[0].error, undefined);
    assert.deepStrictEqual(missingNamespaceFunctions[0].results, []);
  } finally {
    await driver.close();
  }
}

function createDriver(port) {
  return new KdbDriver({
    id: 'live-q',
    name: 'Live q',
    driver: 'KDB',
    server: '127.0.0.1',
    port,
    database: '.',
    username: '',
    password: '',
    connectionTimeout: 10,
    isConnected: false,
    isActive: false,
  }, async () => []);
}

function simulateSqlToolsFormatInsertQuery(insertQuery) {
  return `${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`;
}

function resolveQPath() {
  const candidates = [
    process.env.KDB_Q_BIN,
    path.join(process.env.HOME || '', '.kx', 'bin', 'q'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const result = cp.spawnSync(process.platform === 'win32' ? 'where' : 'command', process.platform === 'win32' ? ['q'] : ['-v', 'q'], {
    encoding: 'utf8',
    shell: process.platform !== 'win32',
  });
  return result.status === 0 ? result.stdout.split(/\r?\n/).find(Boolean) : null;
}

function startQ(qPath, port) {
  const q = cp.spawn(qPath, [FIXTURE, '-p', String(port)], {
    cwd: PROJECT_ROOT,
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  q.stdout.setEncoding('utf8');
  q.stderr.setEncoding('utf8');
  q.stdout.on('data', chunk => process.env.KDB_SQLTOOLS_LIVE_VERBOSE === '1' && process.stdout.write(chunk));
  q.stderr.on('data', chunk => process.env.KDB_SQLTOOLS_LIVE_VERBOSE === '1' && process.stderr.write(chunk));

  return q;
}

async function stopQ(q) {
  if (!q || q.exitCode !== null || q.signalCode) {
    return;
  }

  q.stdin.write('\\\\\n');
  q.stdin.end();

  const exited = await Promise.race([
    new Promise(resolve => q.once('exit', () => resolve(true))),
    delay(2000).then(() => false),
  ]);

  if (!exited) {
    q.kill('SIGTERM');
  }
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForQ(port, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await canConnect(port)) {
      return;
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for q on port ${port}`);
}

function canConnect(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
