const ContextValue = {
  'CONNECTION': 'connection',
  'CONNECTED_CONNECTION': 'connectedConnection',
  'COLUMN': 'connection.column',
  'FUNCTION': 'connection.function',
  'SCHEMA': 'connection.schema',
  'RESOURCE_GROUP': 'connection.resource_group',
  'DATABASE': 'connection.database',
  'TABLE': 'connection.table',
  'VIEW': 'connection.view',
  'MATERIALIZED_VIEW': 'connection.materializedView',
  'NO_CHILD': 'NO_CHILD',
  'KEYWORDS': 'KEYWORDS',
};

Object.freeze(ContextValue);

module.exports = {
  ContextValue
};