import { DatabaseDriver, NSDatabase } from '@sqltools/types';
import { pgCheckEscape } from './escape-rules';

function escapeColumnNames(col: NSDatabase.IColumn | string, { driver }: { driver?: DatabaseDriver } = {}) {
  let items: string[] = [];
  let colObj: NSDatabase.IColumn = typeof col === 'string' ? <NSDatabase.IColumn>{ label: col } : col;
  switch(driver) {
    // case DatabaseDriver.SQLite:
    //   return `"${tableObj.label}"`;
    case DatabaseDriver.PostgreSQL:
    case DatabaseDriver['AWS Redshift']:
      colObj.table && items.push(pgCheckEscape(colObj.table));
      items.push(pgCheckEscape(colObj.label));
      break;
    // case DatabaseDriver.DB2:
    // case DatabaseDriver.OracleDB:
    // case DatabaseDriver.Cassandra:
    //   tableObj.schema && items.push(tableObj.schema);
    //   items.push(tableObj.label);
    //   break;
    // case DatabaseDriver.MySQL:
    //     tableObj.schema && items.push(`\`${tableObj.schema}\``);
    //     items.push(`\`${tableObj.label}\``);
    //     break;
    // case DatabaseDriver.MSSQL:
    //   tableObj.database && items.push(`[${tableObj.database}]`);
    //   tableObj.schema && items.push(`[${tableObj.schema}]`);
    //   items.push(`[${tableObj.label}]`);
    //   break;
  }
  if (items.length > 0) return items.join('.');
  return colObj.label.toString();
}

export default escapeColumnNames;
