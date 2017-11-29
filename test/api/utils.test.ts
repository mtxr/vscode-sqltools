/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import { Utils } from '../../src/api';

describe('API Utils', () => {
  describe('getHome()', () => {
    beforeEach(() => {
      jest.resetModules();
    });
    it('Should find a home path', () => {
      const HOME = Utils.getHome();

      expect(HOME).not.toBeUndefined();
      expect(typeof HOME).toBe('string');
    });

    it('Should find a home path for env HOME', () => {
      const oldU = process.env.USERPROFILE;
      const oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.HOME = 'Fake home';

      const HOME = Utils.getHome();

      expect(HOME).not.toBeUndefined();
      expect(typeof HOME).toBe('string');

      process.env.USERPROFILE = oldU;
      process.env.HOME = oldH;
    });

    it('Should find a home path for env USERPROFILE', () => {
      const oldU = process.env.USERPROFILE;
      const oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.USERPROFILE = 'Fake home';

      const HOME = Utils.getHome();

      expect(HOME).not.toBeUndefined();
      expect(typeof HOME).toBe('string');

      process.env.USERPROFILE = oldU;
      process.env.HOME = oldH;
    });

    it('Should throw an error if can\'t find home', () => {
      const oldU = process.env.USERPROFILE;
      const oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;

      expect(Utils.getHome).toThrow();
    });
  });

  describe('formatSql()', () => {
    it('Should format query properly', () => {
      let query = 'SELECT * FROM A WHERE colname = \'value\';';
      let expected = 'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  A\n' +
        'WHERE\n' +
        '  colname = \'value\';';
      expect(Utils.formatSql(query)).toEqual(expected);

      query = 'SELECT * FROM [A] WHERE [colname]=N\'value\';';
      expected = 'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  [A]\n' +
        'WHERE\n' +
        '  [colname] = N\'value\';';
      expect(Utils.formatSql(query)).toEqual(expected);

    });

    it('Should format query properly using 4 space identation', () => {
      let query = 'SELECT * FROM A WHERE colname = \'value\';';
      let expected = 'SELECT\n' +
        '    *\n' +
        'FROM\n' +
        '    A\n' +
        'WHERE\n' +
        '    colname = \'value\';';
      expect(Utils.formatSql(query, 4)).toEqual(expected);

      query = 'SELECT * FROM [A] WHERE [colname]=N\'value\';';
      expected = 'SELECT\n' +
        '    *\n' +
        'FROM\n' +
        '    [A]\n' +
        'WHERE\n' +
        '    [colname] = N\'value\';';
      expect(Utils.formatSql(query, 4)).toEqual(expected);

    });
  });
  describe('replacer()', () => {
    const source = 'String ":toBeReplaced"!';
    const expected = 'String "replaced"!';
    const toReplace = { toBeReplaced: 'replaced' };
    expect(Utils.replacer(source, toReplace)).toBe(expected);
  });
});
