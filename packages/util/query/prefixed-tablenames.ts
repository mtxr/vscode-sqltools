import { NSDatabase, DatabaseDriver } from '@sqltools/types';
import { pgCheckEscape } from './escape-rules';

function prefixedtableName(table: Partial<NSDatabase.ITable> | string, { driver }: { driver?: DatabaseDriver } = {}) {
  // @TODO review this. maybe move to driver
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  switch(driver) {
    case 'SQLite':
      return `"${tableObj.label}"`;
    case 'PostgreSQL':
    case 'AWS Redshift':
      tableObj.database && items.push(pgCheckEscape(tableObj.database));
      tableObj.schema && items.push(pgCheckEscape(tableObj.schema));
      items.push(pgCheckEscape(tableObj.label));
      break;
    case 'DB2':
    case 'OracleDB':
    case 'Cassandra':
      tableObj.schema && items.push(tableObj.schema);
      items.push(tableObj.label);
      break;
    case 'MySQL':
        tableObj.schema && items.push(`\`${tableObj.schema}\``);
        items.push(`\`${tableObj.label}\``);
        break;
    case 'MSSQL':
      tableObj.database && items.push(`[${tableObj.database}]`);
      tableObj.schema && items.push(`[${tableObj.schema}]`);
      items.push(`[${tableObj.label}]`);
      break;
  }
  if (items.length > 0) return items.join('.');
  return tableObj.label.toString();
}

export default prefixedtableName;
