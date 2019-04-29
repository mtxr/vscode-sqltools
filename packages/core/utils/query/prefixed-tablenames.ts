import { DatabaseDialect } from '@sqltools/core/interface';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

function prefixedtableName(dialect: DatabaseDialect, table: DatabaseInterface.Table | string) {
  if (typeof table === 'string') return table.toString();
  switch(dialect) {
    case DatabaseDialect.PostgreSQL:
      if (table.tableDatabase)
        return [table.tableDatabase, table.tableSchema, table.name].join('.');
    case DatabaseDialect.MySQL:
        return [`\`${table.tableSchema}\``, `\`${table.name}\``].join('.');
    case DatabaseDialect.OracleDB:
      if(table.tableSchema)
        return [table.tableSchema, table.name].join('.');
  }
  return table.name.toString();
}

export default prefixedtableName;
