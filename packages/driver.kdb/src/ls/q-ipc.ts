import * as net from 'net';
import { ColumnarPanelResult, createColumnarPanelResult } from '../kdb-results';
import { endPerfSpan, isPerfTraceEnabled, perfMark, perfSpan } from '../perf';
import type { PerfDetails, PerfSpan } from '../perf';

const HEADER_LENGTH = 8;
const LITTLE_ENDIAN = 1;
const MESSAGE_SYNC = 1;
const MESSAGE_RESPONSE = 2;
const TYPE_CHAR_VECTOR = 10;
const TYPE_TABLE = 98;
const TYPE_DICTIONARY = 99;
const TYPE_ERROR = -128;
const INT_NULL = -2147483648;
const INT_INFINITY = 2147483647;
const SHORT_NULL = -32768;
const SHORT_INFINITY = 32767;
const Q_EPOCH_DAYS = 10957;
const MS_PER_DAY = 86400000;
const NS_PER_DAY = 86400000000000;
const BIGINT_SHIFT_32 = BigInt(32);
const MIN_SAFE_BIGINT = BigInt(Number.MIN_SAFE_INTEGER);
const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

export type QCellValue = string | number | boolean | null;

export interface QTable {
  qtype: 'table';
  columns: string[];
  rows: Array<{ [key: string]: QDisplayValue }>;
  columnData: QValue[];
  rowCount: number;
  rowsMaterialized?: boolean;
}

export interface QKeyedTable {
  qtype: 'keyedTable';
  keyTable: QTable;
  valueTable: QTable;
  columns: string[];
  rows: Array<{ [key: string]: QDisplayValue }>;
  rowCount: number;
  rowsMaterialized?: boolean;
}

export interface QDict {
  qtype: 'dict';
  keys: QValue;
  values: QValue;
  entries: Array<{ key: QValue; value: QValue }>;
}

export type QDisplayValue = QCellValue;
export type QValue = QCellValue | QValue[] | QTable | QKeyedTable | QDict;

type QNestedDisplayValue = QCellValue | QNestedDisplayValue[] | { [key: string]: QNestedDisplayValue };

export interface QTabularResult {
  cols: string[];
  rows: Array<{ [key: string]: QDisplayValue }>;
  kind: string;
}

export interface QColumnarPanelResult {
  cols: string[];
  result: ColumnarPanelResult;
  kind: string;
  rowsMaterialized: boolean;
}

export interface KdbConnectionOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  timeoutMs?: number;
}

interface PendingQuery {
  query: string;
  resolve(value: QValue): void;
  reject(error: Error): void;
  timeout?: NodeJS.Timer;
  perf?: QIpcQueryPerf;
}

interface QIpcQueryPerf {
  queryId: number;
  queryChars: number;
  queryBytes: number;
  querySpan: PerfSpan | null;
  sendSpan?: PerfSpan | null;
  queryEnded: boolean;
  sendEnded: boolean;
  receiveEnded: boolean;
  receiveSpan?: PerfSpan | null;
  firstByteSeen: boolean;
  receiveChunks: number;
  receiveBytes: number;
  copyCount: number;
  copyBytesCopied: number;
}

let nextQueryId = 1;

export class KdbQError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KdbQError';
  }
}

export class KdbIpcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KdbIpcError';
  }
}

export class QIpcReceiveBuffer {
  private chunks: Buffer[] = [];
  private headIndex = 0;
  private headOffset = 0;
  private queuedBytes = 0;
  private copiedMessages = 0;
  private copiedBytes = 0;

  public get bufferedBytes(): number {
    return this.queuedBytes;
  }

  public get copyCount(): number {
    return this.copiedMessages;
  }

  public get copyBytesCopied(): number {
    return this.copiedBytes;
  }

  public append(chunk: Buffer): void {
    if (!chunk.length) {
      return;
    }
    this.chunks.push(chunk);
    this.queuedBytes += chunk.length;
  }

  public clear(): void {
    this.chunks = [];
    this.headIndex = 0;
    this.headOffset = 0;
    this.queuedBytes = 0;
    this.copiedMessages = 0;
    this.copiedBytes = 0;
  }

  public readMessage(): Buffer | null {
    if (this.queuedBytes < HEADER_LENGTH) {
      return null;
    }

    const length = this.readMessageLength();
    if (this.queuedBytes < length) {
      return null;
    }

    const message = Buffer.allocUnsafe(length);
    this.copyTo(message, length);
    this.consume(length);
    this.copiedMessages += 1;
    this.copiedBytes += length;
    return message;
  }

  private readMessageLength(): number {
    const littleEndian = this.byteAt(0) === LITTLE_ENDIAN;
    const length = littleEndian ? this.readInt32LE(4) : this.readInt32BE(4);
    if (length < HEADER_LENGTH) {
      throw new KdbIpcError(`Invalid q IPC message length ${length}`);
    }
    return length;
  }

  private byteAt(offset: number): number {
    if (offset < 0 || offset >= this.queuedBytes) {
      throw new KdbIpcError('Invalid q IPC receive buffer offset');
    }

    let remaining = offset;
    for (let index = this.headIndex; index < this.chunks.length; index++) {
      const chunk = this.chunks[index];
      const start = index === this.headIndex ? this.headOffset : 0;
      const available = chunk.length - start;
      if (remaining < available) {
        return chunk.readUInt8(start + remaining);
      }
      remaining -= available;
    }

    throw new KdbIpcError('Invalid q IPC receive buffer offset');
  }

  private readInt32LE(offset: number): number {
    return this.byteAt(offset)
      | (this.byteAt(offset + 1) << 8)
      | (this.byteAt(offset + 2) << 16)
      | (this.byteAt(offset + 3) << 24);
  }

  private readInt32BE(offset: number): number {
    return (this.byteAt(offset) << 24)
      | (this.byteAt(offset + 1) << 16)
      | (this.byteAt(offset + 2) << 8)
      | this.byteAt(offset + 3);
  }

  private copyTo(target: Buffer, length: number): void {
    let remaining = length;
    let targetOffset = 0;

    for (let index = this.headIndex; index < this.chunks.length && remaining > 0; index++) {
      const chunk = this.chunks[index];
      const start = index === this.headIndex ? this.headOffset : 0;
      const bytes = Math.min(chunk.length - start, remaining);
      chunk.copy(target, targetOffset, start, start + bytes);
      targetOffset += bytes;
      remaining -= bytes;
    }

    if (remaining !== 0) {
      throw new KdbIpcError('Invalid q IPC receive buffer state');
    }
  }

  private consume(length: number): void {
    if (length < 0 || length > this.queuedBytes) {
      throw new KdbIpcError('Invalid q IPC receive buffer consume length');
    }

    this.queuedBytes -= length;
    let remaining = length;
    while (remaining > 0 && this.headIndex < this.chunks.length) {
      const chunk = this.chunks[this.headIndex];
      const available = chunk.length - this.headOffset;
      if (remaining < available) {
        this.headOffset += remaining;
        remaining = 0;
        break;
      }

      remaining -= available;
      this.headIndex += 1;
      this.headOffset = 0;
    }

    if (this.headIndex >= this.chunks.length) {
      this.chunks = [];
      this.headIndex = 0;
      this.headOffset = 0;
      return;
    }

    if (this.headIndex > 64 && this.headIndex * 2 > this.chunks.length) {
      this.chunks = this.chunks.slice(this.headIndex);
      this.headIndex = 0;
    }
  }
}

export class KdbIpcClient {
  private socket: net.Socket | null = null;
  private receiveBuffer = new QIpcReceiveBuffer();
  private pending: PendingQuery | null = null;
  private queue: PendingQuery[] = [];
  private protocolVersion = 0;

  constructor(private readonly options: KdbConnectionOptions) {}

  public async connect(): Promise<void> {
    if (this.socket && !this.socket.destroyed) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection({
        host: this.options.host,
        port: this.options.port,
      });
      let settled = false;

      const fail = (error: Error) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        socket.destroy();
        reject(error);
      };

      const cleanup = () => {
        socket.removeListener('connect', onConnect);
        socket.removeListener('data', onHandshakeData);
        socket.removeListener('error', onError);
        socket.removeListener('close', onClose);
        socket.removeListener('timeout', onTimeout);
      };

      const onConnect = () => {
        socket.write(createHandshake(this.options), error => {
          if (error) {
            fail(error);
          }
        });
      };

      const onHandshakeData = (chunk: Buffer) => {
        if (!chunk.length) {
          return;
        }

        const version = chunk.readUInt8(0);
        if (version < 1) {
          fail(new KdbIpcError('kdb+ rejected IPC authentication'));
          return;
        }

        settled = true;
        cleanup();
        socket.setNoDelay(true);
        socket.setTimeout(0);
        socket.on('data', this.handleData);
        socket.on('error', this.handleSocketError);
        socket.on('close', this.handleSocketClose);
        this.protocolVersion = version;
        this.socket = socket;

        if (chunk.length > 1) {
          this.handleData(chunk.slice(1));
        }

        resolve();
      };

      const onError = (error: Error) => fail(error);
      const onClose = () => fail(new KdbIpcError('kdb+ connection closed during handshake'));
      const onTimeout = () => fail(new KdbIpcError(`kdb+ connection timed out after ${this.timeoutMs()} ms`));

      socket.once('connect', onConnect);
      socket.once('data', onHandshakeData);
      socket.once('error', onError);
      socket.once('close', onClose);
      if (this.timeoutMs() > 0) {
        socket.setTimeout(this.timeoutMs(), onTimeout);
      }
    });
  }

  public query(query: string): Promise<QValue> {
    if (!this.socket || this.socket.destroyed) {
      return Promise.reject(new KdbIpcError('kdb+ connection is not open'));
    }

    return new Promise<QValue>((resolve, reject) => {
      this.queue.push({ query, resolve, reject, perf: createQueryPerf(query) });
      this.flushQueue();
    });
  }

  public async close(): Promise<void> {
    const socket = this.socket;
    this.socket = null;
    this.receiveBuffer.clear();
    this.failAll(new KdbIpcError('kdb+ connection closed'));

    if (!socket || socket.destroyed) {
      return;
    }

    await new Promise<void>(resolve => {
      socket.end(() => resolve());
    });
  }

  public getProtocolVersion(): number {
    return this.protocolVersion;
  }

  private timeoutMs(): number {
    return Math.max(0, Number(this.options.timeoutMs || 0));
  }

  private flushQueue() {
    if (this.pending || !this.socket || this.socket.destroyed) {
      return;
    }

    const pending = this.queue.shift();
    if (!pending) {
      return;
    }

    this.pending = pending;
    if (pending.perf) {
      perfMark('q-ipc.query.start', queryPerfDetails(pending.perf));
    }
    if (this.timeoutMs() > 0) {
      pending.timeout = setTimeout(() => {
        this.rejectPending(new KdbIpcError(`kdb+ query timed out after ${this.timeoutMs()} ms`));
        this.socket && this.socket.destroy();
      }, this.timeoutMs());
    }

    const message = serializeTextQuery(pending.query);
    if (pending.perf) {
      const details = { ...queryPerfDetails(pending.perf), bytes: message.length };
      perfMark('q-ipc.send.start', details);
      pending.perf.sendSpan = perfSpan('q-ipc.send', details);
    }

    this.socket.write(message, error => {
      if (pending.perf) {
        finishSendPerf(pending.perf, { error: !!error });
      }
      if (error) {
        this.rejectPending(error);
      }
    });
  }

  private handleData = (chunk: Buffer) => {
    const receivePerf = this.pending && this.pending.perf;
    if (receivePerf) {
      if (!receivePerf.firstByteSeen) {
        receivePerf.firstByteSeen = true;
        perfMark('q-ipc.receive.firstByte', {
          ...queryPerfDetails(receivePerf),
          chunkBytes: chunk.length,
          bufferedBytes: this.receiveBuffer.bufferedBytes,
        });
        receivePerf.receiveSpan = perfSpan('q-ipc.receive', {
          ...queryPerfDetails(receivePerf),
          bufferedBytes: this.receiveBuffer.bufferedBytes,
        });
      }
      receivePerf.receiveChunks += 1;
      receivePerf.receiveBytes += chunk.length;
    }

    this.receiveBuffer.append(chunk);

    try {
      while (true) {
        const copyCountBefore = this.receiveBuffer.copyCount;
        const copyBytesBefore = this.receiveBuffer.copyBytesCopied;
        const message = this.receiveBuffer.readMessage();
        if (!message) {
          return;
        }
        const messagePerf = this.pending && this.pending.perf;
        if (messagePerf) {
          messagePerf.copyCount += this.receiveBuffer.copyCount - copyCountBefore;
          messagePerf.copyBytesCopied += this.receiveBuffer.copyBytesCopied - copyBytesBefore;
          const receiveDetails = {
            ...queryPerfDetails(messagePerf),
            ...messageSizeDetails(message),
            receiveChunks: messagePerf.receiveChunks,
            receiveBytes: messagePerf.receiveBytes,
            copyCount: messagePerf.copyCount,
            copyBytesCopied: messagePerf.copyBytesCopied,
            bufferedRemainderBytes: this.receiveBuffer.bufferedBytes,
          };
          perfMark('q-ipc.receive.complete', {
            ...receiveDetails,
          });
          finishReceivePerf(messagePerf, receiveDetails);
        }
        this.handleMessage(message);
      }
    } catch (error) {
      this.failAll(toError(error));
      this.socket && this.socket.destroy();
    }
  };

  private handleMessage(message: Buffer) {
    const messageType = message.readUInt8(1);
    if (messageType !== MESSAGE_RESPONSE) {
      return;
    }

    const pending = this.pending;
    if (!pending) {
      return;
    }

    this.pending = null;
    if (pending.timeout) {
      clearTimeout(pending.timeout);
    }

    try {
      const value = deserializeQMessage(message, pending.perf ? queryPerfDetails(pending.perf) : undefined);
      if (pending.perf) {
        finishQueryPerf(pending.perf, {
          error: false,
          ...messageSizeDetails(message),
          receiveChunks: pending.perf.receiveChunks,
          receiveBytes: pending.perf.receiveBytes,
          copyCount: pending.perf.copyCount,
          copyBytesCopied: pending.perf.copyBytesCopied,
        });
      }
      pending.resolve(value);
    } catch (error) {
      if (pending.perf) {
        finishQueryPerf(pending.perf, {
          error: true,
          errorName: toError(error).name,
          ...messageSizeDetails(message),
          receiveChunks: pending.perf.receiveChunks,
          receiveBytes: pending.perf.receiveBytes,
          copyCount: pending.perf.copyCount,
          copyBytesCopied: pending.perf.copyBytesCopied,
        });
      }
      pending.reject(toError(error));
    } finally {
      this.flushQueue();
    }
  }

  private handleSocketError = (error: Error) => {
    this.failAll(error);
  };

  private handleSocketClose = () => {
    this.socket = null;
    this.failAll(new KdbIpcError('kdb+ connection closed'));
  };

  private rejectPending(error: Error) {
    const pending = this.pending;
    this.pending = null;
    if (!pending) {
      return;
    }
    if (pending.timeout) {
      clearTimeout(pending.timeout);
    }
    if (pending.perf) {
      const details = {
        error: true,
        errorName: error.name,
        receiveChunks: pending.perf.receiveChunks,
        receiveBytes: pending.perf.receiveBytes,
        copyCount: pending.perf.copyCount,
        copyBytesCopied: pending.perf.copyBytesCopied,
      };
      finishSendPerf(pending.perf, details);
      finishReceivePerf(pending.perf, details);
      finishQueryPerf(pending.perf, details);
    }
    pending.reject(error);
  }

  private failAll(error: Error) {
    this.rejectPending(error);
    const queued = this.queue.splice(0);
    queued.forEach(item => {
      if (item.perf) {
        finishQueryPerf(item.perf, { error: true, errorName: error.name, queued: true });
      }
      item.reject(error);
    });
  }
}

export function serializeTextQuery(query: string): Buffer {
  const text = Buffer.from(query, 'utf8');
  const payload = Buffer.alloc(1 + 1 + 4 + text.length);
  payload.writeInt8(TYPE_CHAR_VECTOR, 0);
  payload.writeUInt8(0, 1);
  payload.writeInt32LE(text.length, 2);
  text.copy(payload, 6);

  const message = Buffer.alloc(HEADER_LENGTH + payload.length);
  message.writeUInt8(LITTLE_ENDIAN, 0);
  message.writeUInt8(MESSAGE_SYNC, 1);
  message.writeUInt8(0, 2);
  message.writeUInt8(0, 3);
  message.writeInt32LE(message.length, 4);
  payload.copy(message, HEADER_LENGTH);
  return message;
}

export function deserializeQMessage(message: Buffer, perfDetails?: PerfDetails): QValue {
  if (message.length < HEADER_LENGTH) {
    throw new KdbIpcError('Invalid q IPC message: header is incomplete');
  }

  const compressed = message.readUInt8(2) === 1;
  let normalized = message;
  if (compressed) {
    const decompressSpan = perfSpan('q-ipc.decompress', {
      ...(perfDetails || {}),
      ...messageSizeDetails(message),
    });
    try {
      normalized = decompressMessage(message);
    } finally {
      endPerfSpan(decompressSpan);
    }
  }

  const littleEndian = normalized.readUInt8(0) === LITTLE_ENDIAN;
  const payload = normalized.slice(HEADER_LENGTH);
  const deserializeSpan = perfSpan('q-ipc.deserialize', {
    ...(perfDetails || {}),
    payloadBytes: payload.length,
    littleEndian,
    compressed,
  });
  try {
    return deserializeQPayload(payload, littleEndian);
  } finally {
    endPerfSpan(deserializeSpan);
  }
}

export function deserializeQPayload(payload: Buffer, littleEndian = true): QValue {
  return new QReader(payload, littleEndian).readObject();
}

export function qValueToTabular(value: QValue): QTabularResult {
  if (isQTable(value)) {
    return {
      cols: value.columns,
      rows: value.rows,
      kind: 'table',
    };
  }

  if (isQKeyedTable(value)) {
    return {
      cols: value.columns,
      rows: value.rows,
      kind: 'keyed table',
    };
  }

  if (isQDict(value)) {
    return {
      cols: ['key', 'value'],
      rows: value.entries.map(entry => ({
        key: normalizeCell(entry.key),
        value: normalizeCell(entry.value),
      })),
      kind: 'dictionary',
    };
  }

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isPlainObject)) {
      const rows = value.map(row => normalizePlainObject(row as unknown as { [key: string]: QValue }));
      return {
        cols: collectColumns(rows),
        rows,
        kind: 'list',
      };
    }

    return {
      cols: ['index', 'value'],
      rows: value.map((item, index) => ({ index, value: normalizeCell(item) })),
      kind: 'list',
    };
  }

  if (isPlainObject(value)) {
    const row = normalizePlainObject(value as unknown as { [key: string]: QValue });
    return {
      cols: Object.keys(row),
      rows: [row],
      kind: 'object',
    };
  }

  return {
    cols: ['value'],
    rows: [{ value: normalizeCell(value) }],
    kind: 'scalar',
  };
}

export function qValueToColumnarPanel(value: QValue): QColumnarPanelResult {
  if (isQTable(value)) {
    const result = qTableToColumnarPanel(value);
    return {
      cols: value.columns,
      result,
      kind: 'table',
      rowsMaterialized: qValueRowsMaterialized(value),
    };
  }

  if (isQKeyedTable(value)) {
    const result = qKeyedTableToColumnarPanel(value);
    return {
      cols: value.columns,
      result,
      kind: 'keyed table',
      rowsMaterialized: qValueRowsMaterialized(value),
    };
  }

  if (isQDict(value)) {
    const result = createColumnarPanelResult(['key', 'value'], value.entries.length, (rowIndex, columnIndex) => {
      const entry = value.entries[rowIndex];
      if (!entry) {
        return null;
      }
      return columnIndex === 0 ? normalizeCell(entry.key) : normalizeCell(entry.value);
    });
    return {
      cols: result.columns,
      result,
      kind: 'dictionary',
      rowsMaterialized: true,
    };
  }

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isPlainObject)) {
      const rows = value.map(row => normalizePlainObject(row as unknown as { [key: string]: QValue }));
      const cols = collectColumns(rows);
      return {
        cols,
        result: createColumnarPanelResult(cols, rows.length, (rowIndex, columnIndex) => {
          const row = rows[rowIndex] || {};
          return row[cols[columnIndex]];
        }),
        kind: 'list',
        rowsMaterialized: true,
      };
    }

    const result = createColumnarPanelResult(['index', 'value'], value.length, (rowIndex, columnIndex) => {
      return columnIndex === 0 ? rowIndex : normalizeCell(value[rowIndex]);
    });
    return {
      cols: result.columns,
      result,
      kind: 'list',
      rowsMaterialized: false,
    };
  }

  if (isPlainObject(value)) {
    const row = normalizePlainObject(value as unknown as { [key: string]: QValue });
    const cols = Object.keys(row);
    return {
      cols,
      result: createColumnarPanelResult(cols, 1, (_rowIndex, columnIndex) => row[cols[columnIndex]]),
      kind: 'object',
      rowsMaterialized: true,
    };
  }

  const result = createColumnarPanelResult(['value'], 1, () => normalizeCell(value));
  return {
    cols: result.columns,
    result,
    kind: 'scalar',
    rowsMaterialized: false,
  };
}

export function qValueRowsMaterialized(value: QValue): boolean {
  if (isQTable(value)) {
    return qTableRowsMaterialized(value);
  }
  if (isQKeyedTable(value)) {
    return qKeyedTableRowsMaterialized(value);
  }
  return true;
}

function createQueryPerf(query: string): QIpcQueryPerf | undefined {
  if (!isPerfTraceEnabled()) {
    return undefined;
  }
  const queryBytes = Buffer.byteLength(query, 'utf8');
  const queryId = nextQueryId++;
  const details = { queryId, queryChars: query.length, queryBytes };
  const querySpan = perfSpan('q-ipc.query.total', details);
  if (!querySpan) {
    return undefined;
  }
  return {
    queryId,
    queryChars: query.length,
    queryBytes,
    querySpan,
    queryEnded: false,
    sendEnded: false,
    receiveEnded: false,
    firstByteSeen: false,
    receiveChunks: 0,
    receiveBytes: 0,
    copyCount: 0,
    copyBytesCopied: 0,
  };
}

function queryPerfDetails(perf: QIpcQueryPerf): PerfDetails {
  return {
    queryId: perf.queryId,
    queryChars: perf.queryChars,
    queryBytes: perf.queryBytes,
  };
}

function finishQueryPerf(perf: QIpcQueryPerf, details?: PerfDetails): void {
  if (perf.queryEnded) {
    return;
  }
  perf.queryEnded = true;
  endPerfSpan(perf.querySpan, details);
}

function finishSendPerf(perf: QIpcQueryPerf, details?: PerfDetails): void {
  if (perf.sendEnded) {
    return;
  }
  perf.sendEnded = true;
  endPerfSpan(perf.sendSpan, details);
}

function finishReceivePerf(perf: QIpcQueryPerf, details?: PerfDetails): void {
  if (perf.receiveEnded || !perf.receiveSpan) {
    return;
  }
  perf.receiveEnded = true;
  endPerfSpan(perf.receiveSpan, details);
}

function messageSizeDetails(message: Buffer): PerfDetails {
  const compressed = message.readUInt8(2) === 1;
  const uncompressedBytes = compressed && message.length >= 12
    ? (message.readUInt8(0) === LITTLE_ENDIAN ? message.readInt32LE(8) : message.readInt32BE(8))
    : message.length;
  return {
    messageBytes: message.length,
    compressed,
    compressedBytes: compressed ? message.length : undefined,
    uncompressedBytes,
  };
}

function createHandshake(options: KdbConnectionOptions): Buffer {
  const username = options.username || '';
  const password = options.password || '';
  const auth = username || password ? `${username}:${password}` : '';

  // Modern q clients advertise the highest IPC protocol they support by
  // appending the version byte before the NUL terminator. Older mock servers
  // also accept this because they only parse up to the NUL. Without this byte,
  // current kdb+/q 5.x responds with version 0 and rejects the handshake.
  return Buffer.concat([Buffer.from(auth, 'utf8'), Buffer.from([3, 0])]);
}

function decompressMessage(message: Buffer): Buffer {
  const littleEndian = message.readUInt8(0) === LITTLE_ENDIAN;
  const uncompressedLength = littleEndian ? message.readInt32LE(8) : message.readInt32BE(8);
  if (uncompressedLength < HEADER_LENGTH) {
    throw new KdbIpcError(`Invalid compressed q IPC length ${uncompressedLength}`);
  }

  // q IPC compression uses a compact byte-pair back-reference scheme.
  const dst = Buffer.alloc(uncompressedLength);
  dst.writeUInt8(message.readUInt8(0), 0);
  dst.writeUInt8(message.readUInt8(1), 1);
  dst.writeUInt8(0, 2);
  dst.writeUInt8(message.readUInt8(3), 3);
  littleEndian ? dst.writeInt32LE(uncompressedLength, 4) : dst.writeInt32BE(uncompressedLength, 4);

  let n = 0;
  let r = 0;
  let f = 0;
  let s = HEADER_LENGTH;
  let p = s;
  let i = 0;
  let d = 12;
  const lookup = new Int32Array(256);

  while (s < dst.length) {
    if (!i) {
      f = message[d++];
      i = 1;
    }
    if (f & i) {
      r = lookup[message[d++]];
      dst[s++] = dst[r++];
      dst[s++] = dst[r++];
      n = message[d++];
      for (let m = 0; m < n; m++) {
        dst[s + m] = dst[r + m];
      }
    } else {
      dst[s++] = message[d++];
    }
    while (p < s - 1) {
      lookup[dst[p] ^ dst[p + 1]] = p++;
    }
    if (f & i) {
      p = (s += n);
    }
    i *= 2;
    if (i === 256) {
      i = 0;
    }
  }

  return dst;
}

class QReader {
  private pos = 0;

  constructor(private readonly buffer: Buffer, private readonly littleEndian: boolean) {}

  public readObject(): QValue {
    const type = this.readInt8();
    if (type === TYPE_ERROR) {
      throw new KdbQError(String(this.readSymbolAtom() || 'error'));
    }

    if (type < 0 && type > -20) {
      return this.readAtom(-type);
    }

    if (type === TYPE_TABLE) {
      return this.readTable();
    }

    if (type === TYPE_DICTIONARY) {
      return this.readDictionary();
    }

    if (type > 99) {
      return this.readFunction(type);
    }

    this.readUInt8();
    const length = this.readInt32Raw();
    if (type === TYPE_CHAR_VECTOR) {
      return this.readString(length);
    }

    const values: QValue[] = [];
    for (let i = 0; i < length; i++) {
      values.push(type === 0 ? this.readObject() : this.readAtom(type));
    }
    return values;
  }

  private readAtom(type: number): QValue {
    switch (type) {
      case 1:
        return this.readInt8() === 1;
      case 2:
        return this.readGuid();
      case 4:
        return this.readUInt8();
      case 5:
        return this.nullableInt(this.readInt16Raw(), SHORT_NULL, SHORT_INFINITY);
      case 6:
        return this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
      case 7:
        return this.readLongAtom();
      case 8:
        return this.nullableFloat(this.readFloatRaw());
      case 9:
        return this.nullableFloat(this.readDoubleRaw());
      case 10:
        return String.fromCharCode(this.readUInt8());
      case 11:
        return this.readSymbolAtom();
      case 12:
        return this.readTimestamp();
      case 13:
        return this.readMonth();
      case 14:
        return this.readDate();
      case 15:
        return this.readDateTime();
      case 16:
        return this.readTimespan();
      case 17:
        return this.readMinute();
      case 18:
        return this.readSecond();
      case 19:
        return this.readTime();
    }

    throw new KdbIpcError(`Unsupported q IPC type ${type}`);
  }

  private readTable(): QTable {
    this.readUInt8();
    const dictType = this.readInt8();
    if (dictType !== TYPE_DICTIONARY) {
      throw new KdbIpcError(`Invalid q table payload: expected dictionary, got ${dictType}`);
    }

    const columns = this.readObject();
    const values = this.readObject();
    return makeQTable(columns, values);
  }

  private readDictionary(): QDict | QKeyedTable {
    const keys = this.readObject();
    const values = this.readObject();
    if (isQTable(keys) && isQTable(values)) {
      return makeQKeyedTable(keys, values);
    }
    return makeQDict(keys, values);
  }

  private readFunction(type: number): QValue {
    if (type === 100) {
      this.readSymbolAtom();
      this.readObject();
      return '[lambda]';
    }

    if (type < 104) {
      return this.readInt8() === 0 && type === 101 ? null : '[function]';
    }

    if (type > 105) {
      this.readObject();
    } else {
      const length = this.readInt32Raw();
      for (let i = 0; i < length; i++) {
        this.readObject();
      }
    }

    return '[function]';
  }

  private readTimestamp(): QValue {
    const value = this.readLongNumber();
    return value === null ? null : formatTimestamp(value);
  }

  private readMonth(): QValue {
    const value = this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
    if (value === null || !Number.isFinite(value as number)) {
      return value;
    }
    const raw = value as number;
    const year = 2000 + Math.floor(raw / 12);
    const month = ((raw % 12) + 12) % 12;
    return `${year.toString().padStart(4, '0')}.${(month + 1).toString().padStart(2, '0')}`;
  }

  private readDate(): QValue {
    const value = this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
    if (value === null || !Number.isFinite(value as number)) {
      return value;
    }
    return formatDate(value as number);
  }

  private readDateTime(): QValue {
    const value = this.nullableFloat(this.readDoubleRaw());
    if (value === null || !Number.isFinite(value as number)) {
      return value;
    }
    return formatDateTime(value as number);
  }

  private readTimespan(): QValue {
    const value = this.readLongNumber();
    return value === null ? null : formatDuration(value);
  }

  private readMinute(): QValue {
    const value = this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
    return value === null || !Number.isFinite(value as number) ? value : formatClock((value as number) * 60000, 'minute');
  }

  private readSecond(): QValue {
    const value = this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
    return value === null || !Number.isFinite(value as number) ? value : formatClock((value as number) * 1000, 'second');
  }

  private readTime(): QValue {
    const value = this.nullableInt(this.readInt32Raw(), INT_NULL, INT_INFINITY);
    return value === null || !Number.isFinite(value as number) ? value : formatClock(value as number, 'millisecond');
  }

  private readGuid(): QValue {
    const parts: string[] = [];
    for (let i = 0; i < 16; i++) {
      const byte = this.readUInt8();
      if (i === 4 || i === 6 || i === 8 || i === 10) {
        parts.push('-');
      }
      parts.push((byte >> 4).toString(16));
      parts.push((byte & 15).toString(16));
    }
    const guid = parts.join('');
    return guid === '00000000-0000-0000-0000-000000000000' ? null : guid;
  }

  private readSymbolAtom(): QValue {
    const end = this.buffer.indexOf(0, this.pos);
    if (end < 0) {
      throw new KdbIpcError('Invalid q symbol: missing terminator');
    }
    const value = this.buffer.slice(this.pos, end).toString('utf8');
    this.pos = end + 1;
    return value || null;
  }

  private readLongAtom(): QValue {
    const parts = this.readLongParts();
    if (parts.low === 0 && parts.high === INT_NULL) {
      return null;
    }
    if (parts.low === -1 && parts.high === INT_INFINITY) {
      return Infinity;
    }
    if (parts.low === 1 && parts.high === INT_NULL) {
      return -Infinity;
    }

    const value = longPartsToBigInt(parts.low, parts.high);
    return value >= MIN_SAFE_BIGINT && value <= MAX_SAFE_BIGINT ? Number(value) : value.toString();
  }

  private readLongNumber(): number | null {
    const parts = this.readLongParts();

    if (parts.low === 0 && parts.high === INT_NULL) {
      return null;
    }
    if (parts.low === -1 && parts.high === INT_INFINITY) {
      return Infinity;
    }
    if (parts.low === 1 && parts.high === INT_NULL) {
      return -Infinity;
    }

    return Number(longPartsToBigInt(parts.low, parts.high));
  }

  private readLongParts(): { low: number; high: number } {
    return {
      low: this.readInt32Raw(),
      high: this.readInt32Raw(),
    };
  }

  private nullableInt(value: number, nullValue: number, infinityValue: number): QValue {
    if (value === nullValue) {
      return null;
    }
    if (value === infinityValue) {
      return Infinity;
    }
    if (value === -infinityValue) {
      return -Infinity;
    }
    return value;
  }

  private nullableFloat(value: number): QValue {
    return Number.isNaN(value) ? null : value;
  }

  private readString(length: number): string {
    this.ensure(length);
    const value = this.buffer.slice(this.pos, this.pos + length).toString('utf8');
    this.pos += length;
    return value;
  }

  private readInt8(): number {
    this.ensure(1);
    const value = this.buffer.readInt8(this.pos);
    this.pos += 1;
    return value;
  }

  private readUInt8(): number {
    this.ensure(1);
    const value = this.buffer.readUInt8(this.pos);
    this.pos += 1;
    return value;
  }

  private readInt16Raw(): number {
    this.ensure(2);
    const value = this.littleEndian ? this.buffer.readInt16LE(this.pos) : this.buffer.readInt16BE(this.pos);
    this.pos += 2;
    return value;
  }

  private readInt32Raw(): number {
    this.ensure(4);
    const value = this.littleEndian ? this.buffer.readInt32LE(this.pos) : this.buffer.readInt32BE(this.pos);
    this.pos += 4;
    return value;
  }

  private readFloatRaw(): number {
    this.ensure(4);
    const value = this.littleEndian ? this.buffer.readFloatLE(this.pos) : this.buffer.readFloatBE(this.pos);
    this.pos += 4;
    return value;
  }

  private readDoubleRaw(): number {
    this.ensure(8);
    const value = this.littleEndian ? this.buffer.readDoubleLE(this.pos) : this.buffer.readDoubleBE(this.pos);
    this.pos += 8;
    return value;
  }

  private ensure(length: number) {
    if (this.pos + length > this.buffer.length) {
      throw new KdbIpcError('Invalid q IPC payload: unexpected end of buffer');
    }
  }
}

function makeQTable(columnsValue: QValue, columnDataValue: QValue): QTable {
  const columns = asList(columnsValue).map(valueToColumnName);
  const columnData = asList(columnDataValue);
  const rowCount = columns.length === 0 ? 0 : Math.max(...columnData.slice(0, columns.length).map(vectorLength));
  const table = {
    qtype: 'table',
    columns,
    columnData,
    rowCount,
  } as QTable;
  defineLazyRows(
    table,
    () => materializeQTableRows(table),
    'q-ipc.table.materialize',
    { rows: rowCount, columns: columns.length }
  );
  return table;
}

function makeQKeyedTable(keyTable: QTable, valueTable: QTable): QKeyedTable {
  const columns = keyTable.columns.slice();
  valueTable.columns.forEach(column => columns.push(uniqueColumnName(column, columns)));
  const rowCount = Math.max(qTableRowCount(keyTable), qTableRowCount(valueTable));
  const table = {
    qtype: 'keyedTable',
    keyTable,
    valueTable,
    columns,
    rowCount,
  } as QKeyedTable;
  defineLazyRows(
    table,
    () => materializeQKeyedTableRows(table),
    'q-ipc.keyedTable.materialize',
    {
      rows: rowCount,
      columns: columns.length,
      keyColumns: keyTable.columns.length,
      valueColumns: valueTable.columns.length,
    }
  );
  return table;
}

function defineLazyRows(
  target: QTable | QKeyedTable,
  materialize: () => Array<{ [key: string]: QDisplayValue }>,
  spanName: string,
  details: PerfDetails
): void {
  let rows: Array<{ [key: string]: QDisplayValue }> | undefined;
  let materialized = false;
  Object.defineProperty(target, 'rows', {
    enumerable: true,
    configurable: true,
    get(): Array<{ [key: string]: QDisplayValue }> {
      if (!rows) {
        const materializeSpan = perfSpan(spanName, details);
        try {
          rows = materialize();
          materialized = true;
        } finally {
          endPerfSpan(materializeSpan, {
            ...details,
            rows: rows ? rows.length : 0,
            materialized,
          });
        }
      }
      return rows;
    },
  });
  Object.defineProperty(target, 'rowsMaterialized', {
    enumerable: false,
    configurable: true,
    get(): boolean {
      return materialized;
    },
  });
}

function materializeQTableRows(table: QTable): Array<{ [key: string]: QDisplayValue }> {
  const rows: Array<{ [key: string]: QDisplayValue }> = [];
  for (let rowIndex = 0; rowIndex < qTableRowCount(table); rowIndex++) {
    const row: { [key: string]: QDisplayValue } = {};
    table.columns.forEach((column, columnIndex) => {
      row[column] = qTableCellValue(table, rowIndex, columnIndex);
    });
    rows.push(row);
  }
  return rows;
}

function materializeQKeyedTableRows(table: QKeyedTable): Array<{ [key: string]: QDisplayValue }> {
  const rows: Array<{ [key: string]: QDisplayValue }> = [];
  for (let rowIndex = 0; rowIndex < table.rowCount; rowIndex++) {
    const row: { [key: string]: QDisplayValue } = {};
    table.keyTable.columns.forEach((column, columnIndex) => {
      row[column] = qTableCellValue(table.keyTable, rowIndex, columnIndex);
    });
    table.valueTable.columns.forEach((_column, columnIndex) => {
      row[table.columns[table.keyTable.columns.length + columnIndex]] = qTableCellValue(table.valueTable, rowIndex, columnIndex);
    });
    rows.push(row);
  }
  return rows;
}

function qTableToColumnarPanel(table: QTable): ColumnarPanelResult {
  return createColumnarPanelResult(table.columns, qTableRowCount(table), (rowIndex, columnIndex) => {
    return qTableCellValue(table, rowIndex, columnIndex);
  });
}

function qKeyedTableToColumnarPanel(table: QKeyedTable): ColumnarPanelResult {
  return createColumnarPanelResult(table.columns, qKeyedTableRowCount(table), (rowIndex, columnIndex) => {
    if (columnIndex < table.keyTable.columns.length) {
      return qTableCellValue(table.keyTable, rowIndex, columnIndex);
    }
    return qTableCellValue(table.valueTable, rowIndex, columnIndex - table.keyTable.columns.length);
  });
}

function qTableCellValue(table: QTable, rowIndex: number, columnIndex: number): QDisplayValue {
  if (columnIndex < 0 || columnIndex >= table.columns.length) {
    return null;
  }
  if (table.columnData && columnIndex < table.columnData.length) {
    return normalizeCell(vectorValueAt(table.columnData[columnIndex], rowIndex));
  }
  const row = table.rows[rowIndex];
  return row ? normalizeCell(row[table.columns[columnIndex]] as QValue) : null;
}

function qTableRowCount(table: QTable): number {
  return typeof table.rowCount === 'number' ? table.rowCount : table.rows.length;
}

function qKeyedTableRowCount(table: QKeyedTable): number {
  return typeof table.rowCount === 'number' ? table.rowCount : table.rows.length;
}

function qTableRowsMaterialized(table: QTable): boolean {
  return table.rowsMaterialized === false ? false : true;
}

function qKeyedTableRowsMaterialized(table: QKeyedTable): boolean {
  if (table.rowsMaterialized === false) {
    return qTableRowsMaterialized(table.keyTable) || qTableRowsMaterialized(table.valueTable);
  }
  return true;
}

function makeQDict(keys: QValue, values: QValue): QDict {
  const keyList = asList(keys);
  const valuesMatchKeys = vectorLength(values) === keyList.length;

  return {
    qtype: 'dict',
    keys,
    values,
    entries: keyList.map((key, index) => ({
      key,
      value: valuesMatchKeys ? vectorValueAt(values, index) : values,
    })),
  };
}

function asList(value: QValue): QValue[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null) {
    return [];
  }
  return [value];
}

function vectorLength(value: QValue): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  if (typeof value === 'string') {
    return value.length;
  }
  return value === null ? 0 : 1;
}

function vectorValueAt(value: QValue | undefined, index: number): QValue {
  if (value === undefined || value === null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[index] === undefined ? null : value[index];
  }
  if (typeof value === 'string') {
    return index < value.length ? value.charAt(index) : null;
  }
  return index === 0 ? value : null;
}

function valueToColumnName(value: QValue): string {
  const base = normalizeCell(value);
  return base === null ? 'null' : String(base);
}

function normalizePlainObject(value: { [key: string]: QValue }): { [key: string]: QDisplayValue } {
  return Object.keys(value).reduce((row, key) => {
    row[key] = normalizeCell(value[key]);
    return row;
  }, {} as { [key: string]: QDisplayValue });
}

function normalizeCell(value: QValue): QDisplayValue {
  if (isPrimitiveCell(value)) {
    return value;
  }
  return stringifyNestedValue(normalizeNestedValue(value));
}

function normalizeNestedValue(value: QValue): QNestedDisplayValue {
  if (isQTable(value)) {
    return `[table ${qTableRowCount(value)} rows]`;
  }
  if (isQKeyedTable(value)) {
    return `[keyed table ${qKeyedTableRowCount(value)} rows]`;
  }
  if (isQDict(value)) {
    return value.entries.reduce((dict, entry) => {
      dict[valueToColumnName(entry.key)] = normalizeNestedValue(entry.value);
      return dict;
    }, {} as { [key: string]: QNestedDisplayValue });
  }
  if (Array.isArray(value)) {
    return value.map(normalizeNestedValue);
  }
  if (isPlainObject(value)) {
    return Object.keys(value).reduce((row, key) => {
      row[key] = normalizeNestedValue((value as unknown as { [key: string]: QValue })[key]);
      return row;
    }, {} as { [key: string]: QNestedDisplayValue });
  }
  return value;
}

function stringifyNestedValue(value: QNestedDisplayValue): string {
  const result = JSON.stringify(value, (_key, item) => {
    if (typeof item === 'number' && !Number.isFinite(item)) {
      return String(item);
    }
    return item;
  });
  return result === undefined ? String(value) : result;
}

function isPrimitiveCell(value: QValue): value is QCellValue {
  return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function collectColumns(rows: Array<{ [key: string]: QDisplayValue }>): string[] {
  const columns: string[] = [];
  rows.forEach(row => {
    Object.keys(row).forEach(column => {
      if (!columns.includes(column)) {
        columns.push(column);
      }
    });
  });
  return columns;
}

function uniqueColumnName(column: string, existing: string[]): string {
  if (!existing.includes(column)) {
    return column;
  }
  let index = 1;
  let candidate = `${column}_${index}`;
  while (existing.includes(candidate)) {
    index += 1;
    candidate = `${column}_${index}`;
  }
  return candidate;
}

function isQTable(value: QValue): value is QTable {
  return isQTyped(value, 'table');
}

function isQKeyedTable(value: QValue): value is QKeyedTable {
  return isQTyped(value, 'keyedTable');
}

function isQDict(value: QValue): value is QDict {
  return isQTyped(value, 'dict');
}

function isQTyped(value: QValue, qtype: string): boolean {
  return !!value && typeof value === 'object' && !Array.isArray(value) && (value as { qtype?: string }).qtype === qtype;
}

function isPlainObject(value: QValue): boolean {
  return !!value && typeof value === 'object' && !Array.isArray(value) && !(value as { qtype?: string }).qtype;
}

function longPartsToBigInt(low: number, high: number): bigint {
  return (BigInt(high) << BIGINT_SHIFT_32) + BigInt(low >>> 0);
}

function formatTimestamp(nanoseconds: number): string {
  if (!Number.isFinite(nanoseconds)) {
    return String(nanoseconds);
  }
  return new Date(Date.UTC(2000, 0, 1) + Math.trunc(nanoseconds / 1000000)).toISOString();
}

function formatDate(days: number): string {
  return new Date((Q_EPOCH_DAYS + days) * MS_PER_DAY).toISOString().slice(0, 10);
}

function formatDateTime(days: number): string {
  return new Date((Q_EPOCH_DAYS + days) * MS_PER_DAY).toISOString();
}

function formatDuration(nanoseconds: number): string {
  if (!Number.isFinite(nanoseconds)) {
    return String(nanoseconds);
  }
  const sign = nanoseconds < 0 ? '-' : '';
  let remaining = Math.abs(Math.trunc(nanoseconds));
  const days = Math.floor(remaining / NS_PER_DAY);
  remaining -= days * NS_PER_DAY;
  const hours = Math.floor(remaining / 3600000000000);
  remaining -= hours * 3600000000000;
  const minutes = Math.floor(remaining / 60000000000);
  remaining -= minutes * 60000000000;
  const seconds = Math.floor(remaining / 1000000000);
  const nanos = remaining - seconds * 1000000000;
  const prefix = days ? `${days}D ` : '';
  return `${sign}${prefix}${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${Math.trunc(nanos).toString().padStart(9, '0')}`;
}

function formatClock(milliseconds: number, precision: 'minute' | 'second' | 'millisecond'): string {
  const hours = Math.floor(milliseconds / 3600000);
  milliseconds -= hours * 3600000;
  const minutes = Math.floor(milliseconds / 60000);
  milliseconds -= minutes * 60000;
  const seconds = Math.floor(milliseconds / 1000);
  milliseconds -= seconds * 1000;
  const base = `${pad2(hours)}:${pad2(minutes)}`;
  if (precision === 'minute') {
    return base;
  }
  if (precision === 'second') {
    return `${base}:${pad2(seconds)}`;
  }
  return `${base}:${pad2(seconds)}.${Math.trunc(milliseconds).toString().padStart(3, '0')}`;
}

function pad2(value: number): string {
  return Math.trunc(value).toString().padStart(2, '0');
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
