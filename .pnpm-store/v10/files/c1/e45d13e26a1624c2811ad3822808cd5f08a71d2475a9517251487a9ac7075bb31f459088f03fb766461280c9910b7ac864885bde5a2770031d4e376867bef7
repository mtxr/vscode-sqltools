"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
describe(`query generator`, () => {
    it(`should be able to create queries`, () => {
        const describeTableSQL = factory_1.default `
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = '${({ table }) => table}'
        AND TABLE_CATALOG = '${({ catalog }) => catalog}'
        AND TABLE_SCHEMA = '${({ schema }) => schema}'
        AND something = '${'smtg'}'
    `;
        const table = 'table';
        const schema = 'schema';
        const catalog = 'catalog';
        const result = describeTableSQL({ table, schema, catalog });
        const expected = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'table' AND TABLE_CATALOG = 'catalog' AND TABLE_SCHEMA = 'schema' AND something = 'smtg'`;
        expect(result).toBe(expected);
    });
});
