// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../../node_modules/@types/node/index.d.ts" />


import { expect } from 'chai';
import * as vscode from 'vscode';
import { Utils } from '../../src/api';

describe('API Utils', () => {
  describe('getHome()', () => {
    it('Should find a home path', () => {
      const HOME = Utils.getHome();

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');
    });

    it('Should find a home path for env HOME', () => {
      const oldU = process.env.USERPROFILE;
      const oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.HOME = 'Fake home';

      const HOME = Utils.getHome();

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');

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

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');

      process.env.USERPROFILE = oldU;
      process.env.HOME = oldH;
    });

    it('Should throw an error if can\'t find home', () => {
      const oldU = process.env.USERPROFILE;
      const oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;

      expect(Utils.getHome).to.throw();
    });
  });

  describe('formatSql()', () => {
    it('Should format query properly',  () => {
      let query = 'SELECT * FROM A WHERE colname = \'value\';';
      let expected = 'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  A\n' +
        'WHERE\n' +
        '  colname = \'value\';\n';
      expect(Utils.formatSql(query)).to.be.eqls(expected);

      query = 'SELECT * FROM [A] WHERE [colname]=N\'value\';';
      expected = 'SELECT\n' +
        '  *\n' +
        'FROM\n' +
        '  [A]\n' +
        'WHERE\n' +
        '  [colname] = N\'value\';\n';
      expect(Utils.formatSql(query)).to.be.eqls(expected);

    })
  });
});
