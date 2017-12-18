/// <reference path="./../../../node_modules/@types/node/index.d.ts" />

jest.mock('vscode');

import { Logger } from './../../api';
import LogWriter from './../../log-writer';

describe('Logger', () => {
  it('should throws error if no writer provided', () => {
    expect(() => new Logger()).toThrow(Error);
  });

  it('should create logger with success', () => {
    const output = new LogWriter();
    expect(new Logger(output)).toBeInstanceOf(Logger);
  });

  it('should return if is logging', () => {
    const output = new LogWriter();
    const logger = new Logger(output);
    expect(logger.isLogging()).toBe(false);
    logger.setLogging(true);
    expect(logger.isLogging()).toBe(true);
    logger.setLogging(false);
    expect(logger.isLogging()).toBe(false);
  });

  it('should log using various methods', () => {
    const output = new LogWriter();
    const o = output.getOutputChannel() as any;
    o.appendLine = jest.fn();
    const logger = new Logger(output).setLogging(true) as any;
    o.appendLine.mockClear(); // clear for setLogging message
    logger.debug('teste');
    logger.error('teste');
    logger.info('teste');
    logger.warn('teste');

    o.appendLine.mock.calls.forEach((call) => {
      expect(call[0])
        .toMatch(/^\[(\d+\-?){3}T(\d+:?){3}.+\]\[v(\d+\.?){3}\] [A-Z]{4,5}: teste$/);
    });
    o.appendLine.mockReset();
  });

  it('should not log if log level is info', () => {
    const output = new LogWriter();
    const o = output.getOutputChannel() as any;
    o.appendLine = jest.fn();
    const logger = new Logger(output).setLevel(Logger.levels.INFO).setLogging(true) as any;
    o.appendLine.mockClear(); // clear for setLogging message
    logger.debug('teste');
    expect(o.appendLine.mock.calls).toHaveLength(0);
    logger.error('teste');
    expect(o.appendLine.mock.calls).toHaveLength(1);
    logger.info('teste');
    expect(o.appendLine.mock.calls).toHaveLength(2);
    logger.warn('teste');
    logger.warn('teste');
    logger.warn('teste');
    expect(o.appendLine.mock.calls).toHaveLength(5);
    o.appendLine.mockReset();
  });
});
