import { DatabaseDriver, NSDatabase } from '@sqltools/types';

function prefixedtableName(driver: DatabaseDriver, table: NSDatabase.ITable | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  switch(driver) {
    case DatabaseDriver.SQLite:
      return `"${tableObj.label}"`;
    case DatabaseDriver.PostgreSQL:
    case DatabaseDriver['AWS Redshift']:
      tableObj.database && items.push(`"${tableObj.database}"`);
      tableObj.schema && items.push(`"${tableObj.schema}"`);
      items.push(`"${tableObj.label}"`);
      break;
    case DatabaseDriver.DB2:
    case DatabaseDriver.OracleDB:
    case DatabaseDriver.Cassandra:
      tableObj.schema && items.push(tableObj.schema);
      items.push(tableObj.label);
      break;
    case DatabaseDriver.MySQL:
        tableObj.schema && items.push(`\`${tableObj.schema}\``);
        items.push(`\`${tableObj.label}\``);
        break;
    case DatabaseDriver.MSSQL:
      tableObj.database && items.push(`[${tableObj.database}]`);
      tableObj.schema && items.push(`[${tableObj.schema}]`);
      items.push(`[${tableObj.label}]`);
      break;
  }
  if (items.length > 0) return items.join('.');
  return tableObj.label.toString();
}

export default prefixedtableName;
