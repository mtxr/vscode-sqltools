/// <reference path="./../../../node_modules/@types/node/index.d.ts" />

jest.mock('fs');

import fs = require('fs');
import path = require('path');
import { BookmarksStorage, Utils } from './../../api';
import { NotFoundException, SizeException } from './../../api/exception';

describe('BookmarksStorage', () => {
  let filepath;
  const oldH = process.env.HOME;

  beforeAll(() => {
    process.env.HOME = '/fakehome';
    filepath = path.join(Utils.getHome(), 'Testing.SQLToolsStorage.json');
  });

  afterAll(() => {
    process.env.HOME = oldH;
  });

  beforeEach(() => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  });

  it('create bookmarks', () => {
    const bookmarks = new BookmarksStorage().clear();
    expect(bookmarks).toBeInstanceOf(BookmarksStorage);
  });

  it('re-create bookmarks with file was truncated', () => {
    fs.writeFileSync(filepath, '');
    const bookmarks = new BookmarksStorage('Testing').clear();
    expect(bookmarks).toBeInstanceOf(BookmarksStorage);
  });

  it('should add and get size correctly', () => {
    const bookmarks = new BookmarksStorage('Testing').clear();
    expect(bookmarks.getSize()).toEqual(0);
    bookmarks.add('alias', 'Query');
    expect(bookmarks.getSize()).toEqual(1);
    bookmarks.add('alias1', 'Query');
    expect(bookmarks.getSize()).toEqual(2);
  });

  it('should return all items', () => {
    const bookmarks = new BookmarksStorage('Testing').clear();
    bookmarks.add('alias', 'Query');
    expect(bookmarks.all()).toEqual({alias: 'Query'});
  });

  it('should return query for a given alias', () => {
    const bookmarks = new BookmarksStorage('Testing').clear();
    bookmarks.add('alias', 'Query');
    expect(bookmarks.get('alias')).toEqual('Query');
  });

  it('should throw error if query does\'t exists', () => {
    const bookmarks = new BookmarksStorage('Testing').clear();
    expect(() => bookmarks.get('alias')).toThrowError('Query not found!');
  });

  it('should delete query for a give nalias', () => {
    const bookmarks = new BookmarksStorage('Testing').clear();
    bookmarks.add('alias', 'Query');
    expect(bookmarks.get('alias')).toEqual('Query');
    bookmarks.delete('alias');
    expect(bookmarks.getSize()).toEqual(0);
    expect(() => bookmarks.get('alias')).toThrowError(NotFoundException);
  });
});
