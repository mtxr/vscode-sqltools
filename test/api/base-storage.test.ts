/// <reference path="./../../node_modules/@types/node/index.d.ts" />

jest.mock('fs');

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import BaseStorage from './../../src/api/base-storage';
import { NotFoundException, SizeException } from './../../src/api/exception';
import Utils from './../../src/api/utils';

describe('BaseStorage', () => {
  let filepath;
  const oldH = process.env.HOME;

  beforeAll(() => {
    process.env.HOME = '/fakehome';
    filepath = path.join(Utils.getHome(), 'TestingBase.SQLToolsStorage.json');
  });

  afterAll(() => {
    process.env.HOME = oldH;
  });

  beforeEach(() => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    jest.resetAllMocks();
  });

  it('create storage without default serializable', () => {
    const baseStorage = new BaseStorage(filepath);
    expect(baseStorage).toBeInstanceOf(BaseStorage);
    expect(fs.readFileSync(filepath).toString()).toEqual('{}');
  });

  it('create storage with default serializable', () => {
    fs.writeFileSync(filepath, '');
    const baseStorage = new BaseStorage(filepath, []);
    expect(fs.readFileSync(filepath).toString()).toEqual('[]');
  });

  it('re-create storage with default serializable', () => {
    const baseStorage = new BaseStorage(filepath, []);
    fs.writeFileSync(filepath, '');
    baseStorage.readFile();
    expect(fs.readFileSync(filepath).toString()).toEqual('[]');
  });
});
