import { DatabaseDialect } from '@sqltools/core/interface';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

function prefixedtableName(dialect: DatabaseDialect, table: DatabaseInterface.Table | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <DatabaseInterface.Table>{ name: table } : table;
  switch(dialect) {
    case DatabaseDialect.SQLite:
      return `"${tableObj.name}"`;
    case DatabaseDialect.PostgreSQL:
    case DatabaseDialect['AWS Redshift']:
      tableObj.tableDatabase && items.push(`"${tableObj.tableDatabase}"`);
      tableObj.tableSchema && items.push(`"${tableObj.tableSchema}"`);
      items.push(`"${tableObj.name}"`);
      break;
    case DatabaseDialect.DB2:
    case DatabaseDialect.OracleDB:
    case DatabaseDialect.Cassandra:
      tableObj.tableSchema && items.push(tableObj.tableSchema);
      items.push(tableObj.name);
      break;
    case DatabaseDialect.MySQL:
        tableObj.tableSchema && items.push(`\`${tableObj.tableSchema}\``);
        items.push(`\`${tableObj.name}\``);
        break;
    case DatabaseDialect.MSSQL:
      tableObj.tableCatalog && items.push(`[${tableObj.tableCatalog}]`);
      tableObj.tableSchema && items.push(`[${tableObj.tableSchema}]`);
      items.push(`[${tableObj.name}]`);
      break;
  }
  if (items.length > 0) return items.join('.');
  return tableObj.name.toString();
}

export default prefixedtableName;
