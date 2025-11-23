const ContextValue = {
  'CONNECTION': 'connection',
  'CONNECTED_CONNECTION': 'connectedConnection',
  'COLUMN': 'connection.column',
  'KEY': 'connection.key',
  'CONSTRAINT': 'connection.constraint',
  'TRIGGER': 'connection.trigger',
  'INDEX': 'connection.index',
  'FUNCTION': 'connection.function',
  'PROCEDURE': 'connection.procedure',
  'SCHEMA': 'connection.schema',
  'RESOURCE_GROUP': 'connection.resource_group',
  'DATABASE': 'connection.database',
  'TABLE': 'connection.table',
  'VIEW': 'connection.view',
  'MATERIALIZED_VIEW': 'connection.materializedView',
  'TYPE': 'connection.type',
  'SEQUENCE': 'connection.sequence',
  'NO_CHILD': 'NO_CHILD',
  'KEYWORDS': 'KEYWORDS',
};

Object.freeze(ContextValue);

module.exports = {
  ContextValue
};