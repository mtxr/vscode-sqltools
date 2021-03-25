/**
 * copied from https://github.com/TeamSQL/SQL-Statement-Parser/blob/dev/src/index.ts
 * minor improvements
 */

class QueryParser {
  static parse(query: string, driver: 'pg' | 'mysql' | 'mssql' | 'cql' = 'mysql'): Array<string> {
    if (driver === 'mssql') {
      query = query.replace(/^[ \t]*GO;?[ \t]*$/gim, '');
    }
    const delimiter: string = ';';
    const queries: Array<string> = [];
    const flag = true;
    let restOfQuery;
    while (flag) {
      if (restOfQuery == null) {
        restOfQuery = query;
      }
      const statementAndRest = QueryParser.getStatements(restOfQuery, driver, delimiter);

      const statement = statementAndRest[0];
      if (statement != null && statement.trim() != '') {
        queries.push(statement);
      }

      restOfQuery = statementAndRest[1];
      if (restOfQuery == null || restOfQuery.trim() == '') {
        break;
      }
    }

    return queries;
  }

  static getStatements(query: string, driver: string, delimiter: string): Array<string> {
    let previousChar: string = null;
    let isInComment: boolean = false;
    let isInString: boolean = false;
    let isInTag: boolean = false;
    let nextChar: string = null;
    let commentChar: string = null;
    let stringChar: string = null;
    let tagChar: string = null;
    const charArray: Array<string> = Array.from(query);

    let resultQueries: Array<string> = [];
    for (let index = 0; index < charArray.length; index++) {
      let char = charArray[index];
      if (index > 0) {
        previousChar = charArray[index - 1];
      }

      if (index < charArray.length) {
        nextChar = charArray[index + 1];
      }

      // it's in string, go to next char
      if (previousChar != '\\' && (char == "'" || char == '"') && isInString == false && isInComment == false) {
        isInString = true;
        stringChar = char;
        continue;
      }

      // it's comment, go to next char
      if (
        ((char == '#' && nextChar == ' ') || (char == '-' && nextChar == '-') || (char == '/' && nextChar == '*')) &&
        isInString == false
      ) {
        isInComment = true;
        commentChar = char;
        continue;
      }
      // it's end of comment, go to next
      if (
        isInComment == true &&
        (((commentChar == '#' || commentChar == '-') && char == '\n') ||
          (commentChar == '/' && char == '*' && nextChar == '/'))
      ) {
        isInComment = false;
        commentChar = null;
        continue;
      }

      // string closed, go to next char
      if (previousChar != '\\' && char == stringChar && isInString == true) {
        isInString = false;
        stringChar = null;
        continue;
      }

      if (char.toLowerCase() == 'd' && isInComment == false && isInString == false) {
        const delimiterResult = QueryParser.getDelimiter(index, query, driver);
        if (delimiterResult != null) {
          // it's delimiter
          const delimiterSymbol: string = delimiterResult[0];
          const delimiterEndIndex: number = delimiterResult[1];
          query = query.substring(delimiterEndIndex);
          resultQueries = QueryParser.getStatements(query, driver, delimiterSymbol);
          break;
        }
      }

      if (char == '$' && isInComment == false && isInString == false) {
        const queryUntilTagSymbol = query.substring(index);
        if (isInTag == false) {
          const tagSymbolResult = QueryParser.getTag(queryUntilTagSymbol, driver);
          if (tagSymbolResult != null) {
            isInTag = true;
            tagChar = tagSymbolResult[0];
          }
        } else {
          const tagSymbolResult = QueryParser.getTag(queryUntilTagSymbol, driver);
          if (tagSymbolResult != null) {
            const tagSymbol = tagSymbolResult[0];
            if (tagSymbol == tagChar) {
              isInTag = false;
            }
          }
        }
      }
      if (
        driver === 'mssql' &&
        char.toLowerCase() === 'g' &&
        `${charArray[index + 1] || ''}`.toLowerCase() === 'o' &&
        typeof charArray[index + 2] !== 'undefined' &&
        /go\b/gi.test(`${char}${charArray[index + 1]}${charArray[index + 2]}`)
      ) {
        char = `${char}${charArray[index + 1]}`;
      }

      // it's a query, continue until you get delimiter hit
      if (
        (char.toLowerCase() === delimiter.toLowerCase() || char.toLowerCase() === 'go') &&
        isInString == false &&
        isInComment == false &&
        isInTag == false
      ) {
        let splittingIndex = index + 1;
        if (driver === 'mssql' && char.toLowerCase() === 'go') {
          splittingIndex = index;
          resultQueries = QueryParser.getQueryParts(query, splittingIndex, 2);
          break;
        }
        resultQueries = QueryParser.getQueryParts(query, splittingIndex, 0);
        break;
      }
    }
    if (resultQueries.length == 0) {
      if (query != null) {
        query = query.trim();
      }
      resultQueries.push(query, null);
    }

    return resultQueries;
  }

  static getQueryParts(query: string, splittingIndex: number, numChars: number = 1): Array<string> {
    let statement: string = query.substring(0, splittingIndex);
    const restOfQuery: string = query.substring(splittingIndex + numChars);
    const result: Array<string> = [];
    if (statement != null) {
      statement = statement.trim();
    }
    result.push(statement);
    result.push(restOfQuery);
    return result;
  }

  static getDelimiter(index: number, query: string, driver: string): Array<any> {
    if (driver == 'mysql') {
      const delimiterKeyword = 'delimiter ';
      const delimiterLength = delimiterKeyword.length;
      const parsedQueryAfterIndexOriginal = query.substring(index);
      const indexOfDelimiterKeyword = parsedQueryAfterIndexOriginal.toLowerCase().indexOf(delimiterKeyword);
      if (indexOfDelimiterKeyword == 0) {
        let parsedQueryAfterIndex = query.substring(index);
        let indexOfNewLine = parsedQueryAfterIndex.indexOf('\n');
        if (indexOfNewLine == -1) {
          indexOfNewLine = query.length;
        }
        parsedQueryAfterIndex = parsedQueryAfterIndex.substring(0, indexOfNewLine);
        parsedQueryAfterIndex = parsedQueryAfterIndex.substring(delimiterLength);
        let delimiterSymbol = parsedQueryAfterIndex.trim();
        delimiterSymbol = QueryParser.clearTextUntilComment(delimiterSymbol);
        if (delimiterSymbol != null) {
          delimiterSymbol = delimiterSymbol.trim();
          const delimiterSymbolEndIndex =
            parsedQueryAfterIndexOriginal.indexOf(delimiterSymbol) + index + delimiterSymbol.length;
          const result: Array<any> = [];
          result.push(delimiterSymbol);
          result.push(delimiterSymbolEndIndex);
          return result;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  static getTag(query: string, driver: string): Array<any> {
    if (driver == 'pg') {
      const matchTag = query.match(/^(\$[a-zA-Z]*\$)/i);
      if (matchTag != null && matchTag.length > 1) {
        const result: Array<any> = [];
        const tagSymbol = matchTag[1].trim();
        const indexOfCmd = query.indexOf(tagSymbol);
        result.push(tagSymbol);
        result.push(indexOfCmd);
        return result;
      } else {
        return null;
      }
    }
  }

  static isGoDelimiter(driver: string, query: string, index: number): boolean {
    if (driver == 'mssql') {
      const match = /(?:\bgo\b\s*)/i.exec(query);
      if (match != null && match.index == index) {
        return true;
      } else {
        return false;
      }
    }
  }

  static clearTextUntilComment(text: string): string {
    // const previousChar: string = null;
    let nextChar: string = null;
    let clearedText: string = null;
    const charArray: Array<string> = Array.from(text);
    for (let index = 0; index < charArray.length; index++) {
      const char = charArray[index];
      // if (index > 0) {
      //   previousChar = charArray[index - 1];
      // }

      if (index < charArray.length) {
        nextChar = charArray[index + 1];
      }

      if ((char == '#' && nextChar == ' ') || (char == '-' && nextChar == '-') || (char == '/' && nextChar == '*')) {
        break;
      } else {
        if (clearedText == null) {
          clearedText = '';
        }
        clearedText += char;
      }
    }

    return clearedText;
  }
}

export default QueryParser.parse;
