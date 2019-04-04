/**
 * copied from https://github.com/TeamSQL/SQL-Statement-Parser/blob/master/src/index.ts
 * minor improvements
 */

class QueryParser {
  static parse(query: string, dialect: 'pg' | 'mysql' | 'mssql' = 'mysql', delimiter: string = ';'): Array<string> {
    var queries: Array<string> = [];
    var flag = true;
    while (flag) {
      if (restOfQuery == null) {
        restOfQuery = query;
      }
      var statementAndRest = this.getStatements(restOfQuery, dialect, delimiter);

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

  private static getStatements(query: string, dialect: string, delimiter: string): Array<string> {
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
        var delimiterResult = this.getDelimiter(index, query, dialect);
        if (delimiterResult != null) {
          // it's delimiter
          var delimiterSymbol: string = delimiterResult[0];
          var delimiterEndIndex: number = delimiterResult[1];
          query = query.substring(delimiterEndIndex);
          resultQueries = this.getStatements(query, dialect, delimiterSymbol);
          break;
        }
      }

      if (char == '$' && isInComment == false && isInString == false) {
        var queryUntilTagSymbol = query.substring(index);
        if (isInTag == false) {
          var tagSymbolResult = this.getTag(queryUntilTagSymbol, dialect);
          if (tagSymbolResult != null) {
            isInTag = true;
            tagChar = tagSymbolResult[0];
          }
        } else {
          var tagSymbolResult = this.getTag(queryUntilTagSymbol, dialect);
          if (tagSymbolResult != null) {
            var tagSymbol = tagSymbolResult[0];
            if (tagSymbol == tagChar) {
              isInTag = false;
            }
          }
        }
      }

      if (delimiter.length > 1 && charArray[index + delimiter.length - 1] != undefined) {
        for (var i = index + 1; i < index + delimiter.length; i++) {
          char += charArray[i];
        }
      }

      // it's a query, continue until you get delimiter hit
      if (
        char.toLowerCase() == delimiter.toLowerCase() &&
        isInString == false &&
        isInComment == false &&
        isInTag == false
      ) {
        if (this.isGoDelimiter(dialect, query, index) == false) {
          continue;
        }
        var splittingIndex = index;
        // if (delimiter == ";") {     splittingIndex = index + 1 }
        resultQueries = this.getQueryParts(query, splittingIndex, delimiter);
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

  private static getQueryParts(query: string, splittingIndex: number, delimiter: string): Array<string> {
    var statement: string = query.substring(0, splittingIndex);
    var restOfQuery: string = query.substring(splittingIndex + delimiter.length);
    var result: Array<string> = [];
    if (statement != null) {
      statement = statement.trim();
    }
    result.push(statement);
    result.push(restOfQuery);
    return result;
  }

  private static getDelimiter(index: number, query: string, dialect: string): Array<any> {
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
        delimiterSymbol = this.clearTextUntilComment(delimiterSymbol);
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

  private static getTag(query: string, dialect: string): Array<any> {
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

  private static isGoDelimiter(dialect: string, query: string, index: number): boolean {
    if (dialect == 'mssql') {
      var match = /(?:\bgo\b\s*)/i.exec(query);
      if (match != null && match.index == index) {
        return true;
      } else {
        return false;
      }
    }
  }

  private static clearTextUntilComment(text: string): string {
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