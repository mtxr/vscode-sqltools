import { DatabaseDialect } from '@sqltools/core/interface';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

function prefixedtableName(dialect: DatabaseDialect, table: DatabaseInterface.Table | string) {
  if (typeof table === 'string') return table.toString();
  let items: string[] = [];
  switch(dialect) {
    case DatabaseDialect.PostgreSQL:
      table.tableDatabase && items.push(table.tableDatabase);
    case DatabaseDialect.OracleDB:
      table.tableSchema && items.push(table.tableSchema);
      items.push(table.name);
      break;
    case DatabaseDialect.MySQL:
        table.tableSchema && items.push(`\`${table.tableSchema}\``);
        items.push(`\`${table.name}\``);
        break;
  }
  if (items.length > 0) return items.join('.');
  return table.name.toString();
}

export default prefixedtableName;
