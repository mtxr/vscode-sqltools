const net = require('net');

const HEADER_LENGTH = 8;
const LITTLE_ENDIAN = 1;
const MESSAGE_SYNC = 1;
const MESSAGE_RESPONSE = 2;
const TYPE_ERROR = -128;

const SAMPLE_ROWS = [
  { sym: 'AAPL', size: 100, price: 123.45 },
  { sym: 'MSFT', size: 250, price: 234.56 },
];

class MockQServer {
  constructor() {
    this.port = 0;
    this.server = null;
    this.sockets = new Set();
    this.queries = [];
    this.handshakes = [];
  }

  start() {
    if (this.server) {
      return Promise.resolve();
    }

    this.server = net.createServer(socket => this.handleSocket(socket));
    return new Promise((resolve, reject) => {
      const onError = error => {
        cleanup();
        reject(error);
      };
      const cleanup = () => {
        this.server && this.server.removeListener('error', onError);
      };

      this.server.once('error', onError);
      this.server.listen(0, '127.0.0.1', () => {
        cleanup();
        const address = this.server.address();
        this.port = typeof address === 'object' && address ? address.port : 0;
        resolve();
      });
    });
  }

  stop() {
    const sockets = Array.from(this.sockets);
    sockets.forEach(socket => socket.destroy());
    this.sockets.clear();

    if (!this.server) {
      return Promise.resolve();
    }

    const server = this.server;
    this.server = null;
    return new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }

  handleSocket(socket) {
    this.sockets.add(socket);

    let authenticated = false;
    let buffer = Buffer.alloc(0);

    socket.on('close', () => this.sockets.delete(socket));
    socket.on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk]);

      if (!authenticated) {
        const terminator = buffer.indexOf(0);
        if (terminator < 0) {
          return;
        }

        this.handshakes.push(buffer.slice(0, terminator).toString('utf8'));
        buffer = buffer.slice(terminator + 1);
        authenticated = true;
        socket.write(Buffer.from([3]));
      }

      while (buffer.length >= HEADER_LENGTH) {
        const length = readMessageLength(buffer);
        if (buffer.length < length) {
          return;
        }

        const message = buffer.slice(0, length);
        buffer = buffer.slice(length);

        try {
          const query = readTextQuery(message);
          this.queries.push(query);
          socket.write(responseFrame(responsePayload(query)));
        } catch (error) {
          socket.write(responseFrame(errorPayload(error.message)));
        }
      }
    });
  }
}

function readMessageLength(buffer) {
  const littleEndian = buffer.readUInt8(0) === LITTLE_ENDIAN;
  return littleEndian ? buffer.readInt32LE(4) : buffer.readInt32BE(4);
}

function readTextQuery(message) {
  if (message.readUInt8(1) !== MESSAGE_SYNC) {
    throw new Error(`expected sync query message, got message type ${message.readUInt8(1)}`);
  }

  const type = message.readInt8(HEADER_LENGTH);
  if (type !== 10) {
    throw new Error(`expected text query payload, got q type ${type}`);
  }

  const length = message.readInt32LE(HEADER_LENGTH + 2);
  return message.slice(HEADER_LENGTH + 6, HEADER_LENGTH + 6 + length).toString('utf8');
}

function responsePayload(query) {
  const compact = query.replace(/\s+/g, ' ').trim();

  if (compact === '1+1') {
    return longAtom(2);
  }

  if (compact.includes('ts:tables') || compact.includes('tbls:tables') || compact.includes('tbls:@[tables')) {
    return tablesTable();
  }

  if (compact.includes('views[]') || compact.includes('system "b ') || compact.includes('@[views') || compact.includes('@[system;"b "')) {
    return viewsTable();
  }

  if (compact.includes('system "f ') || compact.includes('@[system;"f "')) {
    return functionsTable();
  }

  if (compact.includes('0!meta') || compact.includes('meta p') || compact.includes('meta tbl')) {
    return columnsTable();
  }

  if (compact.includes('count value p') || compact.includes('count value tbl')) {
    return countTable();
  }

  if (compact.includes('sublist value p') || compact.includes('sublist value tbl') || compact.includes('select') || compact.includes('trade')) {
    return sampleTradeTable();
  }

  return errorPayload(`mock q IPC server has no response for query: ${compact}`);
}

function responseFrame(payload) {
  const message = Buffer.alloc(HEADER_LENGTH + payload.length);
  message.writeUInt8(LITTLE_ENDIAN, 0);
  message.writeUInt8(MESSAGE_RESPONSE, 1);
  message.writeUInt8(0, 2);
  message.writeUInt8(0, 3);
  message.writeInt32LE(message.length, 4);
  payload.copy(message, HEADER_LENGTH);
  return message;
}

function errorPayload(message) {
  return Buffer.concat([int8(TYPE_ERROR), cString(message)]);
}

function tablesTable() {
  return qTable(
    ['label', 'type', 'schema', 'database', 'isView', 'childType'],
    [
      symbolVector(['trade', 'quote']),
      symbolVector(['connection.table', 'connection.table']),
      symbolVector(['.', '.']),
      symbolVector(['.', '.']),
      booleanVector([false, false]),
      symbolVector(['connection.column', 'connection.column']),
    ]
  );
}

function viewsTable() {
  return qTable(
    ['label', 'type', 'schema', 'database', 'isView', 'childType'],
    [
      symbolVector([]),
      symbolVector([]),
      symbolVector([]),
      symbolVector([]),
      booleanVector([]),
      symbolVector([]),
    ]
  );
}

function functionsTable() {
  return qTable(
    ['label', 'name', 'type', 'schema', 'database', 'signature', 'args', 'resultType', 'childType', 'iconName'],
    [
      symbolVector(['calcSpread']),
      symbolVector(['calcSpread']),
      symbolVector(['connection.function']),
      symbolVector(['.']),
      symbolVector(['.']),
      symbolVector(['calcSpread']),
      symbolVector(['']),
      symbolVector(['function']),
      symbolVector(['NO_CHILD']),
      symbolVector(['function']),
    ]
  );
}

function columnsTable() {
  return qTable(
    ['label', 'dataType', 'type', 'table', 'schema', 'database', 'isNullable', 'childType', 'c', 't', 'f', 'a'],
    [
      symbolVector(['sym', 'size', 'price']),
      charVector('sif'),
      symbolVector(['connection.column', 'connection.column', 'connection.column']),
      symbolVector(['trade', 'trade', 'trade']),
      symbolVector(['.', '.', '.']),
      symbolVector(['.', '.', '.']),
      booleanVector([true, true, true]),
      symbolVector(['NO_CHILD', 'NO_CHILD', 'NO_CHILD']),
      symbolVector(['sym', 'size', 'price']),
      charVector('sif'),
      symbolVector(['', '', '']),
      symbolVector(['', '', '']),
    ]
  );
}

function countTable() {
  return qTable(['total'], [longVector([SAMPLE_ROWS.length])]);
}

function sampleTradeTable() {
  return qTable(
    ['sym', 'size', 'price'],
    [
      symbolVector(SAMPLE_ROWS.map(row => row.sym)),
      intVector(SAMPLE_ROWS.map(row => row.size)),
      floatVector(SAMPLE_ROWS.map(row => row.price)),
    ]
  );
}

function qTable(columns, vectors) {
  return Buffer.concat([
    int8(98),
    Buffer.from([0]),
    int8(99),
    symbolVector(columns),
    genericList(vectors),
  ]);
}

function genericList(items) {
  return Buffer.concat([vectorHeader(0, items.length)].concat(items));
}

function symbolVector(values) {
  return Buffer.concat([vectorHeader(11, values.length)].concat(values.map(value => cString(value))));
}

function charVector(value) {
  const body = Buffer.from(value, 'utf8');
  return Buffer.concat([vectorHeader(10, body.length), body]);
}

function booleanVector(values) {
  return Buffer.concat([vectorHeader(1, values.length), Buffer.from(values.map(value => value ? 1 : 0))]);
}

function intVector(values) {
  const body = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => body.writeInt32LE(value, index * 4));
  return Buffer.concat([vectorHeader(6, values.length), body]);
}

function longVector(values) {
  const body = Buffer.alloc(values.length * 8);
  values.forEach((value, index) => writeInt64LE(body, value, index * 8));
  return Buffer.concat([vectorHeader(7, values.length), body]);
}

function floatVector(values) {
  const body = Buffer.alloc(values.length * 8);
  values.forEach((value, index) => body.writeDoubleLE(value, index * 8));
  return Buffer.concat([vectorHeader(9, values.length), body]);
}

function longAtom(value) {
  const payload = Buffer.alloc(9);
  payload.writeInt8(-7, 0);
  writeInt64LE(payload, value, 1);
  return payload;
}

function vectorHeader(type, length) {
  const header = Buffer.alloc(6);
  header.writeInt8(type, 0);
  header.writeUInt8(0, 1);
  header.writeInt32LE(length, 2);
  return header;
}

function int8(value) {
  const buffer = Buffer.alloc(1);
  buffer.writeInt8(value, 0);
  return buffer;
}

function cString(value) {
  return Buffer.from(`${value}\0`, 'utf8');
}

function writeInt64LE(buffer, value, offset) {
  if (typeof buffer.writeBigInt64LE === 'function') {
    buffer.writeBigInt64LE(BigInt(value), offset);
    return;
  }

  const low = value | 0;
  const high = Math.floor(value / 0x100000000);
  buffer.writeInt32LE(low, offset);
  buffer.writeInt32LE(high, offset + 4);
}

module.exports = {
  MockQServer,
};
