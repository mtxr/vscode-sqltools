/**
 * copied from https://github.com/TeamSQL/SQL-Statement-Parser/blob/master/src/index.ts
 * minor improvements
 */

class QueryParser {
  static parse(query: string, dialect: 'pg' | 'mysql' | 'mssql' = 'mysql'): Array<string> {
    if (dialect === 'mssql') {
      query = query.replace(/^[ \t]*GO;?[ \t]*$/gmi, '');
    }
    const delimiter: string = ';';
    var queries: Array<string> = [];
    var flag = true;
    while (flag) {
      if (restOfQuery == null) {
        restOfQuery = query;
      }
      var statementAndRest = QueryParser.getStatements(restOfQuery, dialect, delimiter);

      var statement = statementAndRest[0];
      if (statement != null && statement.trim() != '') {
        queries.push(statement);
      }

      var restOfQuery = statementAndRest[1];
      if (restOfQuery == null || restOfQuery.trim() == '') {
        break;
      }
    }

    return queries;
  }

  static getStatements(query: string, dialect: string, delimiter: string): Array<string> {
    var charArray: Array<string> = Array.from(query);
    var previousChar: string = null;
    var nextChar: string = null;
    var isInComment: boolean = false;
    var commentChar: string = null;
    var isInString: boolean = false;
    var stringChar: string = null;
    var isInTag: boolean = false;
    var tagChar: string = null;

    var resultQueries: Array<string> = [];
    for (var index = 0; index < charArray.length; index++) {
      var char = charArray[index];
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
          (commentChar == '/' && (char == '*' && nextChar == '/')))
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
        var delimiterResult = QueryParser.getDelimiter(index, query, dialect);
        if (delimiterResult != null) {
          // it's delimiter
          var delimiterSymbol: string = delimiterResult[0];
          var delimiterEndIndex: number = delimiterResult[1];
          query = query.substring(delimiterEndIndex);
          resultQueries = QueryParser.getStatements(query, dialect, delimiterSymbol);
          break;
        }
      }

      if (char == '$' && isInComment == false && isInString == false) {
        var queryUntilTagSymbol = query.substring(index);
        if (isInTag == false) {
          var tagSymbolResult = QueryParser.getTag(queryUntilTagSymbol, dialect);
          if (tagSymbolResult != null) {
            isInTag = true;
            tagChar = tagSymbolResult[0];
          }
        } else {
          var tagSymbolResult = QueryParser.getTag(queryUntilTagSymbol, dialect);
          if (tagSymbolResult != null) {
            var tagSymbol = tagSymbolResult[0];
            if (tagSymbol == tagChar) {
              isInTag = false;
            }
          }
        }
      }
      if (
        dialect === 'mssql'
        && char.toLowerCase() === 'g'
        && `${charArray[index + 1] || ''}`.toLowerCase() === 'o'
        && (
          typeof charArray[index + 2] !== 'undefined'
          && /go\b/gi.test(`${char}${charArray[index + 1]}${charArray[index + 2]}`)
        )
      ) {
        char = `${char}${charArray[index + 1]}`;
      }

      // it's a query, continue until you get delimiter hit
      if (
        (char.toLowerCase() === delimiter.toLowerCase() || char.toLowerCase() === 'go') &&
        isInString == false &&
        isInComment == false &&
        isInTag == false
      ) {
        var splittingIndex = index + 1;
        if (dialect === 'mssql' && char.toLowerCase() === 'go') {
          splittingIndex = index;
          resultQueries = QueryParser.getQueryParts(query, splittingIndex, 2);
          break;
        }
        resultQueries = QueryParser.getQueryParts(query, splittingIndex);
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
    var statement: string = query.substring(0, splittingIndex);
    var restOfQuery: string = query.substring(splittingIndex + numChars);
    var result: Array<string> = [];
    if (statement != null) {
      statement = statement.trim();
    }
    result.push(statement);
    result.push(restOfQuery);
    return result;
  }

  static getDelimiter(index: number, query: string, dialect: string): Array<any> {
    if (dialect == 'mysql') {
      var delimiterKeyword = 'delimiter ';
      var delimiterLength = delimiterKeyword.length;
      var parsedQueryAfterIndexOriginal = query.substring(index);
      var indexOfDelimiterKeyword = parsedQueryAfterIndexOriginal.toLowerCase().indexOf(delimiterKeyword);
      if (indexOfDelimiterKeyword == 0) {
        var parsedQueryAfterIndex = query.substring(index);
        var indexOfNewLine = parsedQueryAfterIndex.indexOf('\n');
        if (indexOfNewLine == -1) {
          indexOfNewLine = query.length;
        }
        parsedQueryAfterIndex = parsedQueryAfterIndex.substring(0, indexOfNewLine);
        parsedQueryAfterIndex = parsedQueryAfterIndex.substring(delimiterLength);
        var delimiterSymbol = parsedQueryAfterIndex.trim();
        delimiterSymbol = QueryParser.clearTextUntilComment(delimiterSymbol);
        if (delimiterSymbol != null) {
          delimiterSymbol = delimiterSymbol.trim();
          var delimiterSymbolEndIndex =
            parsedQueryAfterIndexOriginal.indexOf(delimiterSymbol) + index + delimiterSymbol.length;
          var result: Array<any> = [];
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

  static getTag(query: string, dialect: string): Array<any> {
    if (dialect == 'pg') {
      var matchTag = query.match(/^(\$[a-zA-Z]*\$)/i);
      if (matchTag != null && matchTag.length > 1) {
        var result: Array<any> = [];
        var tagSymbol = matchTag[1].trim();
        var indexOfCmd = query.indexOf(tagSymbol);
        result.push(tagSymbol);
        result.push(indexOfCmd);
        return result;
      } else {
        return null;
      }
    }
  }

  static isGoDelimiter(dialect: string, query: string, index: number): boolean {
    if (dialect == 'mssql') {
      var match = /(?:\bgo\b\s*)/i.exec(query);
      if (match != null && match.index == index) {
        return true;
      } else {
        return false;
      }
    }
  }

  static clearTextUntilComment(text: string): string {
    // var previousChar: string = null;
    var nextChar: string = null;
    var charArray: Array<string> = Array.from(text);
    var clearedText: string = null;
    for (var index = 0; index < charArray.length; index++) {
      var char = charArray[index];
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