import { TokenTypes, Config, Token } from './types';
import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import Tokenizer from './Tokenizer';

const spaceChars = [' ', '\t'];
const trimSpacesEnd = (str: string) => {
  let end = str.length - 1;
  while (end >= 0 && spaceChars.includes(str[end])) {
    end--;
  }
  return str.substring(0, end + 1);
};

export default class Formatter {
  private tokens: Token[] = [];
  private previousReservedWord: Token = { type: null, value: null };
  private previousNonWhiteSpace: Token = { type: null, value: null };
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private params: Params;
  private index = 0;
  /**
   * @param {Config} cfg
   *   @param {string} cfg.indent
   *   @param {Object} cfg.params
   * @param {Tokenizer} tokenizer
   */
  constructor(public cfg: Config, public tokenizer: Tokenizer, private tokenOverride?: (token: Token, previousToken?: Token) => Token) {
    this.indentation = new Indentation(this.cfg.indent);
    this.inlineBlock = new InlineBlock();
    this.params = new Params(this.cfg.params);
  }

  /**
   * Formats whitespaces in a SQL string to make it easier to read.
   *
   * @param {string} query The SQL query string
   * @return {string} formatted query
   */
  format(query: string) {
    this.tokens = this.tokenizer.tokenize(query);
    const formattedQuery = this.getFormattedQueryFromTokens();

    return formattedQuery.trim();
  }

  getFormattedQueryFromTokens() {
    let formattedQuery = '';

    this.tokens.forEach((token, index) => {
      this.index = index;

      if (this.tokenOverride) token = this.tokenOverride(token, this.previousReservedWord) || token;

      if (token.type === TokenTypes.WHITESPACE) {
        formattedQuery = this.formatWhitespace(token, formattedQuery);
      } else if (token.type === TokenTypes.LINE_COMMENT) {
        formattedQuery = this.formatLineComment(token, formattedQuery);
      } else if (token.type === TokenTypes.BLOCK_COMMENT) {
        formattedQuery = this.formatBlockComment(token, formattedQuery);
      } else if (
        token.type === TokenTypes.RESERVED_TOP_LEVEL
        || token.type === TokenTypes.RESERVED_TOP_LEVEL_NO_INDENT
        || token.type === TokenTypes.RESERVED_NEWLINE
        || token.type === TokenTypes.RESERVED
      ) {
        formattedQuery = this.formatReserved(token, formattedQuery);
      } else if (token.type === TokenTypes.OPEN_PAREN) {
        formattedQuery = this.formatOpeningParentheses(token, formattedQuery);
      } else if (token.type === TokenTypes.CLOSE_PAREN) {
        formattedQuery = this.formatClosingParentheses(token, formattedQuery);
      } else if (token.type === TokenTypes.NO_SPACE_OPERATOR) {
        formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
      } else if (token.type === TokenTypes.PLACEHOLDER || token.type === TokenTypes.SERVERVARIABLE) {
        formattedQuery = this.formatPlaceholder(token, formattedQuery);
      } else if (token.value === ',') {
        formattedQuery = this.formatComma(token, formattedQuery);
      } else if (token.value === ':') {
        formattedQuery = this.formatWithSpaceAfter(token, formattedQuery);
      } else if (token.value === '.') {
        formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
      } else if (token.value === ';') {
        formattedQuery = this.formatQuerySeparator(token, formattedQuery);
      } else {
        formattedQuery = this.formatWithSpaces(token, formattedQuery);
      }

      if (token.type !== TokenTypes.WHITESPACE) {
        this.previousNonWhiteSpace = token;
      }
    });
    return formattedQuery;
  }

  formatWhitespace(token: Token, query: string) {
    if (
      this.cfg.linesBetweenQueries === 'preserve'
      && /((\r\n|\n)(\r\n|\n)+)/u.test(token.value)
      && this.previousToken().value === ';'
    ) {
      return query.replace(/(\n|\r\n)$/u, '') + token.value;
    }
    return query
  }

  formatReserved(token: Token, query: string) {
    // reserved words combination check
    if (
      token.type === TokenTypes.RESERVED_NEWLINE
      && this.previousReservedWord
      && this.previousReservedWord.value
      && token.value.toUpperCase() === 'AND' &&
      this.previousReservedWord.value.toUpperCase() === 'BETWEEN'
    ) {
      token.type = TokenTypes.RESERVED;
    }

    if (token.type === TokenTypes.RESERVED_TOP_LEVEL) {
      query = this.formatTopLevelReservedWord(token, query);
    } else if (token.type === TokenTypes.RESERVED_TOP_LEVEL_NO_INDENT) {
      query = this.formatTopLevelReservedWordNoIndent(token, query);
    } else if (token.type === TokenTypes.RESERVED_NEWLINE) {
      query = this.formatNewlineReservedWord(token, query);
    } else {
      // TokenTypes.RESERVED
      query = this.formatWithSpaces(token, query);
    }

    this.previousReservedWord = token;
    return query;
  }

  formatLineComment(token: Token, query: string) {
    return this.addNewline(query + token.value);
  }

  formatBlockComment(token: Token, query: string) {
    return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
  }

  indentComment(comment: string) {
    return comment.replace(/\n[ \t]*/gu, '\n' + this.indentation.getIndent() + ' ');
  }

  formatTopLevelReservedWordNoIndent(token: Token, query: string) {
    this.indentation.decreaseTopLevel();
    query = this.addNewline(query) + this.equalizeWhitespace(this.formatReservedWord(token.value));
    return this.addNewline(query);
  }

  formatTopLevelReservedWord(token: Token, query: string) {
    const shouldChangeTopLevel = (this.previousNonWhiteSpace.value !== ',' && !['GRANT'].includes(`${this.previousNonWhiteSpace.value}`.toUpperCase()));
    if (shouldChangeTopLevel) {
      this.indentation.decreaseTopLevel();
      query = this.addNewline(query);
    }
    query = query + this.equalizeWhitespace(this.formatReservedWord(token.value)) + ' ';
    if (shouldChangeTopLevel)
      this.indentation.increaseTopLevel();
    return query;
  }

  formatNewlineReservedWord(token: Token, query: string) {
    return (
      this.addNewline(query) + this.equalizeWhitespace(this.formatReservedWord(token.value)) + ' '
    );
  }

  // Replace any sequence of whitespace characters with single space
  equalizeWhitespace(value: string) {
    return value.replace(/\s+/gu, ' ');
  }

  // Opening parentheses increase the block indent level and start a new line
  formatOpeningParentheses(token: Token, query: string) {
    token.value = this.formatCase(token.value);

    // Take out the preceding space unless there was whitespace there in the original query
    // or another opening parens or line comment
    const previousTokenType = this.previousToken().type;
    if (
      previousTokenType !== TokenTypes.WHITESPACE
      && previousTokenType !== TokenTypes.OPEN_PAREN
      && previousTokenType !== TokenTypes.LINE_COMMENT
    ) {
      query = trimSpacesEnd(query);
    }
    query += token.value;

    this.inlineBlock.beginIfPossible(this.tokens, this.index);

    if (!this.inlineBlock.isActive()) {
      this.indentation.increaseBlockLevel();
      query = this.addNewline(query);
    }
    return query;
  }

  // Closing parentheses decrease the block indent level
  formatClosingParentheses(token: Token, query: string) {
    token.value = this.formatCase(token.value);
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      return this.formatWithSpaceAfter(token, query);
    } else {
      this.indentation.decreaseBlockLevel();
      return this.formatWithSpaces(token, this.addNewline(query));
    }
  }

  formatPlaceholder(token: Token, query: string) {
    return query + this.params.get(token) + ' ';
  }

  // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
  formatComma(token: Token, query: string) {
    query = trimSpacesEnd(query) + token.value + ' ';

    if (this.inlineBlock.isActive()) {
      return query;
    } else if (/^LIMIT$/iu.test(this.previousReservedWord.value)) {
      return query;
    } else {
      return this.addNewline(query);
    }
  }

  formatWithSpaceAfter(token: Token, query: string) {
    return trimSpacesEnd(query) + token.value + ' ';
  }

  formatWithoutSpaces(token: Token, query: string) {
    return trimSpacesEnd(query) + token.value;
  }

  formatWithSpaces(token: Token, query: string) {
    const value = token.type === TokenTypes.RESERVED ? this.formatReservedWord(token.value) : token.value;
    return query + value + ' ';
  }

  formatReservedWord(value: string) {
    return this.formatCase(value);
  }

  formatQuerySeparator(token: Token, query: string) {
    this.indentation.resetIndentation();
    let lines = '\n';
    if (this.cfg.linesBetweenQueries !== 'preserve') {
      lines = '\n'.repeat(this.cfg.linesBetweenQueries || 1);
    }
    return trimSpacesEnd(query) + token.value + lines;
  }

  addNewline(query: string) {
    query = trimSpacesEnd(query);
    if (!query.endsWith('\n')) query += '\n';
    return query + this.indentation.getIndent();
  }

  previousToken(): Token {
    return this.tokens[this.index - 1] || { type: null, value: null };
  }

  formatCase(value: string) {
    if (this.cfg.reservedWordCase === 'upper') return value.toUpperCase();
    if (this.cfg.reservedWordCase === 'lower') return value.toLowerCase();
    return value;
  }
}
