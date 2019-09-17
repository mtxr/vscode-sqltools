import { DriverQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants'; // use this separator to create the tree for columns, tables and functions

/**
 * This file define the queries you need to fetch all connection data that SQLTools support.
 */
export default {
  /**
   * This query should return all infomation (or the most common) about an specific table.
   */
  describeTable: 'DESCRIBE :table',
  /**
   * This functions should return all columns we have in the connection. It's used on explorer, intellisense, query generators etc.
   *
   * It should return data to create an object later with the interface DatabaseInterface.TableColumn. Take a look at that interface to see at do you need to fetch for each column.
   */
  fetchColumns: `
SELECT
  tableName,
  columnName,
  type,
  size,
  tableSchema,
  tableCatalog,
  tableDatabase,
  defaultValue,
  isNullable,
  ordinal_position,
  isPk,
  isFk,
  tree
FROM
  information_table
WHERE
  conditions
ORDER BY
  tableName,
  ordinal_position`,
  /**
   * It's like an SELECT ALL from the table, but we should add a safe limit to avoid query to runs forever.
   */
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  /** Same as fetch column, but for tables. Will be used to create an object like DatabaseInterface.Table */
  fetchTables: `
SELECT
  tableName,
  tableSchema,
  tableCatalog,
  isView,
  dbName,
  COUNT(1) AS numberOfColumns,
  tree
FROM
  information_table
WHERE
  conditions
ORDER BY
  tableName;`,
  /** Same as fetch column, but for functions/procedures. Will be used to create an object like DatabaseInterface.Function */
  fetchFunctions: `SELECT ALL my functions`,
} as DriverQueries;