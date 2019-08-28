import formatter from '@sqltools/formatter/src/sqlFormatter';

const dollarRegex = /\$([^\s]+)/gi;
/**
 * Format query with vscode snippet parameters
 * @param query
 * @param originalQuery
 */
function fixParameters(query: string, originalQuery: string) {
  if (!dollarRegex.test(originalQuery)) return query;
  const matches = originalQuery.match(dollarRegex) || [];

  return matches.reduce((text, match) => {
    const matchEscaped = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('\\\$' + ' +' + matchEscaped.substr(2), 'g'), match.replace(/\$/g, '$$$$'));
  }, query);
}

export function format(query: string, formatOptions: Partial<{ indentSize: number, reservedWordCase: 'upper' | 'lower' }> = {}) {
  const { reservedWordCase = null, indentSize = 2 } = formatOptions;
  return fixParameters(formatter.format(query, {
    indent: ' '.repeat(indentSize),
    reservedWordCase,
  }), query);
}