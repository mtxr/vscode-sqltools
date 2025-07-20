import { CompletionItem, CompletionItemKind, Range } from 'vscode-languageserver';
import { ILanguageServerPlugin, ILanguageServer, ContextValue, Arg0, NSDatabase } from '@sqltools/types';
import { getDocumentCurrentQuery } from './query';
import connectionStateCache, { LAST_USED_ID_KEY, ACTIVE_CONNECTIONS_KEY } from '../connection-manager/cache/connections-state.model';
import Connection from '@sqltools/language-server/src/connection';
import { TableCompletionItem, TableColumnCompletionItem, DatabaseCompletionItem } from './models';
import { createLogger } from '@sqltools/log/src';
import sqlAutocompleteParser from 'gethue/parsers/genericAutocompleteParser.js';

const log = createLogger('intellisense');

export default class IntellisensePlugin<T extends ILanguageServer> implements ILanguageServerPlugin<T> {
  private server: T;

  private getQueryData = async (params: Arg0<Arg0<ILanguageServer['onCompletion']>>) => {
    const [activeConnections, lastUsedId] = await Promise.all([
      connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {}) as Promise<{ [k: string]: Connection }>,
      connectionStateCache.get(LAST_USED_ID_KEY) as Promise<string>,
    ])
    const { textDocument, position } = params;
    log.info('completion requested %O', position);
    const doc = this.server.docManager.get(textDocument.uri);

    const { text, currentOffset } = getDocumentCurrentQuery(doc, position);
    const queryTokens = doc.getText(Range.create(Math.max(0, position.line - 5), 0, position.line, position.character)).replace(/[\r\n|\n]+/g, ' ').split(/;/g).pop().split(/\W+/);
    const currentWord = (queryTokens.pop() || '').trim().toUpperCase();

    const conn = activeConnections[lastUsedId];
    let completionDialect: string;

    // @REVIEW check intellisense dialect
    // switch (conn && conn.getDriver()) {
    //   case DatabaseDriver['AWS Redshift']:
    //     completionDialect = DatabaseDriver.PostgreSQL;
    //     break;
    //   case DatabaseDriver.MSSQL:
    //     completionDialect = 'transactsql';
    //     break;
    //   case DatabaseDriver.MySQL:
    //   case DatabaseDriver.MariaDB:
    //     break;
    //   default:
    //     completionDialect = null;
    // }

    return {
      completionDialect,
      currentWord,
      conn,
      text,
      currentOffset
    }
  }

  private getDatabasesCompletions = async ({ currentWord, conn, suggestDatabases }: { conn: Connection; currentWord: string; suggestDatabases: any }): Promise<CompletionItem[]> => {
    const prefix = (suggestDatabases.prependQuestionMark ? "? " : "") + (suggestDatabases.prependFrom ? "FROM " : "");
    const suffix = suggestDatabases.appendDot ? "." : "";

    const dbs = await conn.searchItems(ContextValue.DATABASE, currentWord) as [NSDatabase.IDatabase];
    log.info('got %d db completions', dbs && dbs.length);
    if (dbs && dbs.length > 0) {
      return dbs
        .map(d => ({
          ...DatabaseCompletionItem(d, 0),
          // filterText is used to sort after the initial completion query
          filterText: d.label.substring(d.label.toUpperCase().indexOf(currentWord)),
          label: prefix + d.label + suffix,
        }));
    }
    return [];
  }

  private getTableCompletions = async ({ currentWord, conn, suggestTables }: { conn: Connection; currentWord: string; suggestTables: any }): Promise<CompletionItem[]> => {
    const prefix = (suggestTables.prependQuestionMark ? "? " : "") + (suggestTables.prependFrom ? "FROM " : "");
    const database = suggestTables.identifierChain && suggestTables.identifierChain[0].name;
    const suffix = suggestTables.appendDot ? "." : "";

    const tables = await conn.searchItems(ContextValue.TABLE, currentWord, { database }) as [NSDatabase.ITable];
    log.info('got %d table completions', tables.length);
    if (tables.length > 0) {
      return tables
        .map(t => ({
          ...TableCompletionItem(t, 0),
          // filterText is used to sort after the initial completion query
          filterText: t.label.substring(t.label.toUpperCase().indexOf(currentWord)),
          label: prefix + t.label + suffix,
        }));
    }
    return [];
  }

  private getColumnCompletions = async ({ currentWord, conn, suggestColumns }: { conn: Connection; currentWord: string; suggestColumns: any }): Promise<CompletionItem[]> => {
    const tables = suggestColumns.tables
      .map(table => table.identifierChain.map(id => id.name || id.cte))
      .map((t: [string]) => (<NSDatabase.ITable>{ label: t.pop(), database: t.pop() }));
    const columns = await conn.searchItems(ContextValue.COLUMN, currentWord, {
      tables
    }) as [NSDatabase.IColumn];
    log.info('got %d column completions', columns.length);
    if (columns.length > 0) {
      return columns.map(c => ({
        ...TableColumnCompletionItem(c, { driver: conn.getDriver(), addTable: suggestColumns.tables.length > 1 }),
        // filterText is used to sort after the initial completion query
        filterText: c.label.substring(c.label.toUpperCase().indexOf(currentWord))
      }));
    }
    return [];
  }

  private getHueAst(text: string, currentOffset:number) {
    return sqlAutocompleteParser.parseSql(text.substring(0, currentOffset), text.substring(currentOffset));
  }

  private getKeywordsCompletion(hueAst: any, currentWord: string): CompletionItem[] {
    return (hueAst.suggestKeywords || []).filter(kw => kw.value.startsWith(currentWord)).map(kw => <CompletionItem>{
      label: kw.value,
      detail: kw.value,
      filterText: kw.value,
      // weights provided by hue are in reversed order
      sortText: `${String(10000 - kw.weight).padStart(5, '0')}:${kw.value}`,
      kind: CompletionItemKind.Keyword,
      documentation: {
        value: `\`\`\`yaml\nWORD: ${kw.value}\n\`\`\``,
        kind: 'markdown'
      }
    })
  }

  private getCompletionsFromHueAst = async ({ currentWord, conn, text, currentOffset }: { currentWord: string; conn: Connection | null; text: string; currentOffset: number }): Promise<CompletionItem[]> => {
    let completionsMap = {
      query: [],
      tables: [],
      columns: [],
      dbs: []
    };

    const hueAst = this.getHueAst(text, currentOffset);

    completionsMap.query = this.getKeywordsCompletion(hueAst, currentWord);
    const visitedKeywords: [string] = (hueAst.suggestKeywords || []).map(kw => kw.value)
    
    // Can't distinguish functions types, so put all other keywords
    if (hueAst.suggestFunctions || hueAst.suggestAggregateFunctions || hueAst.suggestAnalyticFunctions) {
      const staticCompletions = await conn.getStaticCompletions();
      for (let keyword in staticCompletions) {
        if (visitedKeywords.includes(keyword)) {
          continue;
        }
        if (!keyword.startsWith(currentWord)) {
          continue;
        }
        visitedKeywords.push(keyword);
        const value: NSDatabase.IStaticCompletion = staticCompletions[keyword]
        completionsMap.query.push({
          ...value, sortText: `4:${value.label}`,
          kind: CompletionItemKind.Function
        });
      }
    }

    const [tableCompletions, columnCompletions, dbCompletions] = await Promise.all([
      (hueAst.suggestTables != undefined) ? this.getTableCompletions({ currentWord, conn, suggestTables: hueAst.suggestTables }) : [],
      (hueAst.suggestColumns != undefined) ? this.getColumnCompletions({ currentWord, conn, suggestColumns: hueAst.suggestColumns }) : [],
      (hueAst.suggestDatabases != undefined) ? this.getDatabasesCompletions({ currentWord, conn, suggestDatabases: hueAst.suggestDatabases }) : [],
    ]);
    completionsMap.tables = tableCompletions;
    completionsMap.columns = columnCompletions;
    completionsMap.dbs = dbCompletions;

    const completions = completionsMap.columns
      .concat(completionsMap.tables)
      .concat(completionsMap.dbs)
      .concat(completionsMap.query);

    return completions;
  }

  private onCompletion: Arg0<ILanguageServer['onCompletion']> = async params => {
    try {
      const {
        currentWord,
        conn,
        text,
        currentOffset
      } = await this.getQueryData(params);

      // When no active connection attatched to the file - return only SQL keywords
      if (!conn) {
        const hueAst = this.getHueAst(text, currentOffset);
        const keywordCompletions = this.getKeywordsCompletion(hueAst, currentWord);

        log.info('no active connection, keyword completions:: %d', keywordCompletions.length);
        return keywordCompletions;
      };

      // First try connection's getCompletionsForRawQuery method if the connection supports it
      const connectionCompletions = await conn.getCompletionsForRawQuery(text, currentOffset);
      if (connectionCompletions !== null) {
        log.info('Got completions from raw the query, count: %d', connectionCompletions.length);
        return connectionCompletions;
      }

      // Fallback to hue AST-based completions
      log.info('Using completions based on hue SQL parser');
      const completions = await this.getCompletionsFromHueAst({ currentWord, conn, text, currentOffset });
      log.info('total completions %d', completions.length);
      return completions;
    } catch (error) {
      log.error('got an error:\n %O', error);
      return [];
    }
  }

  public register(server: T) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          workDoneProgress: true,
          triggerCharacters: [' ', '.', '(', '`', , '[']
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);
  }
}
