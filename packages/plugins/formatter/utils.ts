import formatter from 'sql-formatter/src/sqlFormatter';

// Issue #99. Waiting 3rd party
function nonLatinQuickFix(query: string) {
  return query.replace(/([^\x00-\x7F]) /gi, '$1');
}

export function format(query: string, indentSize: number = 2) {
  return nonLatinQuickFix(formatter.format(query, { indent: ' '.repeat(indentSize) }));
}