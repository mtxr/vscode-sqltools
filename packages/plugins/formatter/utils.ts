import formatter from '@sqltools/formatter';

// Issue #99. Waiting 3rd party
function nonLatinQuickFix(query: string) {
  return query.replace(/([^\x00-\x7F]) /gi, '$1');
}

const dollarRegex = /\$([^\s]+)/gi;

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
  return fixParameters(nonLatinQuickFix(formatter.format(query, {
    indent: ' '.repeat(indentSize),
    reservedWordCase,
  })), query);
}