/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />


import * as vscode from 'vscode';
import { expect } from 'chai';
import { getHome } from '../../src/api/utils'

describe("API Utils", () => {
  describe("getHome()", () => {
    it('Should find a home path', () => {
      const HOME = getHome();

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');
    });

    it('Should find a home path for env HOME', () => {
      let oldU = process.env.USERPROFILE;
      let oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.HOME = 'Fake home';

      const HOME = getHome();

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');

      process.env.USERPROFILE = oldU;
      process.env.HOME = oldH;
    });

    it('Should find a home path for env USERPROFILE', () => {
      let oldU = process.env.USERPROFILE;
      let oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;
      process.env.USERPROFILE = 'Fake home';

      const HOME = getHome();

      expect(HOME).to.be.not.undefined;
      expect(HOME).to.be.a('string');

      process.env.USERPROFILE = oldU;
      process.env.HOME = oldH;
    });

    it('Should throw an error if can\'t find home', () => {
      let oldU = process.env.USERPROFILE;
      let oldH = process.env.HOME;
      delete process.env.USERPROFILE;
      delete process.env.HOME;

      expect(getHome).to.throw();
    });
  });
});
