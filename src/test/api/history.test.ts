/// <reference path="./../../../node_modules/@types/node/index.d.ts" />

import * as vscode from 'vscode';
import { History } from './../../api';
import { NotFoundException, SizeException } from './../../api/exception';

describe('History', () => {
  it('create history using default size', () => {
    const history = new History();
    expect(history).toBeInstanceOf(History);
    expect(history.getMaxSize()).toBe(100);
  });

  it('create history using 10 as max size', () => {
    const history = new History(10);
    expect(history).toBeInstanceOf(History);
    expect(history.getMaxSize()).toBe(10);
  });

  it('should add and get size correctly', () => {
    const history = new History(10);
    expect(history.getSize()).toEqual(0);
    history.add('Query');
    expect(history.getSize()).toEqual(1);
  });

  it('should return all items', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.all()).toHaveLength(1);
    expect(history.all()).toEqual(['Query']);
  });

  it('should return last used query', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.get(0)).toEqual('Query');
  });

  it('should return last used query', () => {
    const history = new History(1);
    history.add('Query');
    history.add('Query2');
    expect(history.get(0)).toEqual('Query2');
    expect(history.all()).toHaveLength(1);
  });

  it('should clear history', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.get(0)).toEqual('Query');
    expect(history.all()).toHaveLength(1);
    history.clear();
    expect(history.all()).toHaveLength(0);
    expect(() => history.get(0)).toThrowError(NotFoundException);
  });

  it('should clear history', () => {
    const history = new History(10);
    expect(history.getMaxSize()).toEqual(10);
    history.setMaxSize(5);
    expect(history.getMaxSize()).toEqual(5);
    expect(() => history.setMaxSize(-1)).toThrow(SizeException);
  });
});
