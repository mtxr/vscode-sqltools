/// <reference path="./../../node_modules/@types/node/index.d.ts" />

jest.mock('vscode');

import LogWriter from './../log-writer';

describe('Log writer', () => {
  it('should log messages using various methods', () => {
    const message = 'Message!';
    const output = new LogWriter();
    const o = output.getOutputChannel() as any;
    o.appendLine = jest.fn();
    output.debug(message);
    output.error(message);
    output.info(message);
    output.warn(message);
    o.appendLine.mock.calls.forEach((call) => {
      expect(call[0]).toMatch(/[A-Z]+\: Message!/);
    });
    o.appendLine.mockClear();

    let expectedData: any = {success: true, message: 'teste'};
    output.debug(message, expectedData);
    output.error(message, expectedData);
    output.info(message, expectedData);
    output.warn(message, expectedData);
    o.appendLine.mock.calls.forEach((call, index) => {
      if (index % 2 === 0) {
        expect(call[0]).toMatch(/[A-Z]+\: Message!/);
        return;
      }
      expect(call[0])
        .toMatch(/^\[(\d+\-?){3}T(\d+:?){3}.+\]\[v(\d+\.?){3}\] \{"success":true,"message":"teste"\}/);
    });
    o.appendLine.mockClear();

    output.warn(message, 'teste');
    expect(o.appendLine.mock.calls[0][0]).toMatch(/[A-Z]+\: Message!/);
    expect(o.appendLine.mock.calls[1][0])
          .toMatch(/^\[(\d+\-?){3}T(\d+:?){3}.+\]\[v(\d+\.?){3}\] teste/);
    o.appendLine.mockClear();

    expectedData = ['dados'];
    output.warn(message, expectedData);
    expect(o.appendLine.mock.calls[0][0]).toMatch(/[A-Z]+\: Message!/);
    expect(o.appendLine.mock.calls[1][0])
          .toMatch(/^\[(\d+\-?){3}T(\d+:?){3}.+\]\[v(\d+\.?){3}\] \["dados"\]/);
    o.appendLine.mockClear();
    o.appendLine.mockReset();
  });

  it('should be able to call show()', () => {
    const message = 'Message!';
    const expectedData = { success: true, message: 'teste' };
    const output = new LogWriter();
    const outputChannel = output.getOutputChannel() as any;
    outputChannel.show = jest.fn() as any;
    output.showOutput();
    expect(outputChannel.show.mock.calls.length > 0).toBe(true);
    outputChannel.show.mockReset();
  });

  it('should call appendLine()', () => {
    const message = 'Message!';
    const expectedData = { success: true, message: 'teste' };
    const output = new LogWriter();
    const outputChannel = output.getOutputChannel() as any;
    outputChannel.appendLine = jest.fn() as any;
    output.debug(message, {});
    expect(outputChannel.appendLine.mock.calls.length > 0).toBe(true);
    outputChannel.appendLine.mockReset();
  });
});
