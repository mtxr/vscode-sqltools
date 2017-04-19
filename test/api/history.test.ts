// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import { expect } from 'chai';
import { stub } from 'sinon';
import * as vscode from 'vscode';
import { History } from './../../src/api';
import { NotFoundException, SizeException } from './../../src/api/exception';

describe('History', () => {
  it('create history using default size', () => {
    const history = new History();
    expect(history).to.be.instanceof(History);
    expect(history.getMaxSize()).to.be.eql(100);
  });

  it('create history using 10 as max size', () => {
    const history = new History(10);
    expect(history).to.be.instanceof(History);
    expect(history.getMaxSize()).to.be.eql(10);
  });

  it('should add and get size correctly', () => {
    const history = new History(10);
    expect(history.getSize()).to.be.eql(0);
    history.add('Query');
    expect(history.getSize()).to.be.eql(1);
  });

  it('should add and get size correctly', () => {
    const history = new History(10);
    expect(history.getSize()).to.be.eql(0);
    history.add('Query');
    expect(history.getSize()).to.be.eql(1);
  });

  it('should return all items', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.all()).to.have.lengthOf(1);
    expect(history.all()).to.be.eql(['Query']);
  });

  it('should return last used query', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.get(0)).to.be.eql('Query');
  });

  it('should return last used query', () => {
    const history = new History(1);
    history.add('Query');
    history.add('Query2');
    expect(history.get(0)).to.be.eql('Query2');
    expect(history.all()).to.have.lengthOf(1);
  });

  it('should clear history', () => {
    const history = new History(10);
    history.add('Query');
    expect(history.get(0)).to.be.eql('Query');
    expect(history.all()).to.have.lengthOf(1);
    history.clear();
    expect(history.all()).to.have.lengthOf(0);
    expect(() => history.get(0)).to.throw(NotFoundException, 'No query selected');
  });

  it('should clear history', () => {
    const history = new History(10);
    expect(history.getMaxSize()).to.be.eql(10);
    history.setMaxSize(5);
    expect(history.getMaxSize()).to.be.eql(5);
    expect(() => history.setMaxSize(-1)).to.throw(SizeException, 'Size can\'t be lower than 1');
  });
});
