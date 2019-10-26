import { DatabaseDriver } from '@sqltools/core/interface';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

function prefixedtableName(driver: DatabaseDriver, table: DatabaseInterface.Table | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <DatabaseInterface.Table>{ name: table } : table;
  switch(driver) {
    case DatabaseDriver.SQLite:
      return `"${tableObj.name}"`;
    case DatabaseDriver.PostgreSQL:
    case DatabaseDriver['AWS Redshift']:
      tableObj.tableDatabase && items.push(`"${tableObj.tableDatabase}"`);
      tableObj.tableSchema && items.push(`"${tableObj.tableSchema}"`);
      items.push(`"${tableObj.name}"`);
      break;
    case DatabaseDriver.DB2:
    case DatabaseDriver.OracleDB:
    case DatabaseDriver.Cassandra:
      tableObj.tableSchema && items.push(tableObj.tableSchema);
      items.push(tableObj.name);
      break;
    case DatabaseDriver.MySQL:
        tableObj.tableSchema && items.push(`\`${tableObj.tableSchema}\``);
        items.push(`\`${tableObj.name}\``);
        break;
    case DatabaseDriver.MSSQL:
      tableObj.tableCatalog && items.push(`[${tableObj.tableCatalog}]`);
      tableObj.tableSchema && items.push(`[${tableObj.tableSchema}]`);
      items.push(`[${tableObj.name}]`);
      break;
  }
  if (items.length > 0) return items.join('.');
  return tableObj.name.toString();
}

export default prefixedtableName;
