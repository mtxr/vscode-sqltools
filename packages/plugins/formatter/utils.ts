import formatter from 'sql-formatter/src/sqlFormatter';

// Issue #99. Waiting 3rd party
function nonLatinQuickFix(query: string) {
  return query.replace(/([^\x00-\x7F]) /gi, '$1');
}

function fixParameters(query: string, originalQuery: string) {
  if (!(/\$\d+/g).test(originalQuery)) return query;
  return query.replace(/\$ (\d+)/g, '\$$1');
}

export function format(query: string, indentSize: number = 2) {
  return fixParameters(nonLatinQuickFix(formatter.format(query, { indent: ' '.repeat(indentSize) })), query);
}