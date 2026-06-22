const assert = require('assert');
const vscode = require('vscode');
const { ContextValue } = require('@sqltools/types');
const { MockQServer } = require('../mock-q-ipc');
const KdbDriver = require('../../../out/ls/driver').default;
const { publisher, name } = require('../../../package.json');

suite('kdb-sqltools VS Code E2E', function () {
  this.timeout(60000);

  let server;

  setup(async () => {
    server = new MockQServer();
    await server.start();
  });

  teardown(async () => {
    if (server) {
      await server.stop();
      server = null;
    }
  });

  test('activates and registers with the real SQLTools extension', async function () {
    if (process.env.KDB_SQLTOOLS_E2E_SQLTOOLS_INSTALLED !== '1') {
      this.skip();
    }

    const sqltools = vscode.extensions.getExtension('mtxr.sqltools');
    assert.ok(sqltools, 'expected mtxr.sqltools to be installed in the VS Code test host');

    const extension = vscode.extensions.getExtension(`${publisher}.${name}`);
    assert.ok(extension, 'expected this extension to be available in the VS Code test host');

    const api = await extension.activate();
    assert.ok(api, 'extension activation should return a SQLTools driver API');
    assert.ok(api.driverAliases.some(alias => alias.value === 'KDB'), 'KDB alias should be registered');
  });

  test('opens, tests, queries, and reads metadata through TCP q IPC', async () => {
    const driver = createDriver(server.port);

    try {
      await driver.testConnection();
      assert.ok(server.queries.includes('1+1'), 'testConnection should execute 1+1 through IPC');

      const queryResults = await driver.query('select from trade');
      assert.strictEqual(queryResults.length, 1);
      assert.strictEqual(queryResults[0].error, undefined);
      assert.deepStrictEqual(queryResults[0].cols, ['sym', 'size', 'price']);
      assert.deepStrictEqual(queryResults[0].results, [
        { sym: 'AAPL', size: 100, price: 123.45 },
        { sym: 'MSFT', size: 250, price: 234.56 },
      ]);

      const connectionItem = {
        label: 'mock q',
        type: ContextValue.CONNECTION,
        database: '.',
        schema: '.',
      };
      const groups = await driver.getChildrenForItem({ item: connectionItem });
      const tablesGroup = groups.find(item => item.label === 'Tables');
      assert.ok(tablesGroup, 'expected a Tables explorer group');

      const tables = await driver.getChildrenForItem({ item: tablesGroup, parent: connectionItem });
      assert.deepStrictEqual(tables.map(table => table.label), ['trade', 'quote']);

      const columnGroups = await driver.getChildrenForItem({ item: tables[0], parent: tablesGroup });
      assert.strictEqual(columnGroups.length, 1);
      assert.strictEqual(columnGroups[0].label, 'Columns');

      const columns = await driver.getChildrenForItem({ item: columnGroups[0], parent: tables[0] });
      assert.deepStrictEqual(columns.map(column => column.label), ['sym', 'size', 'price']);
      assert.deepStrictEqual(columns.map(column => column.dataType), ['symbol', 'int', 'float']);
    } finally {
      await driver.close();
    }
  });
});

function createDriver(port) {
  return new KdbDriver({
    id: 'e2e-mock-q',
    name: 'E2E mock q',
    driver: 'KDB',
    server: '127.0.0.1',
    port,
    database: '.',
    username: '',
    password: '',
    connectionTimeout: 5,
    isConnected: false,
    isActive: false,
  }, async () => []);
}
