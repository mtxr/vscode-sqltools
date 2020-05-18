import { CompletionItem, CompletionItemKind, Range } from 'vscode-languageserver';
import { ILanguageServerPlugin, ILanguageServer, ContextValue, Arg0, NSDatabase } from '@sqltools/types';
import { getDocumentCurrentQuery } from './query';
import connectionStateCache, { LAST_USED_ID_KEY, ACTIVE_CONNECTIONS_KEY } from '../connection-manager/cache/connections-state.model';
import { Parser, Select } from 'node-sql-parser';
import Connection from '@sqltools/language-server/connection';
import { TableCompletionItem, TableColumnCompletionItem } from './models';
import logger from '@sqltools/util/log';
import { tablePrevWords, columnPrevWords } from './constants';
const log = logger.extend('intellisense');

const parser = new Parser();
const IS_WORD_REGEX = /^\w/g;

const parseRetry = (query: string = '', database: string, retry = 5) => {
  let i = 0;
  let err: Error;
  let currentQuery = query.trim();
  while (i < retry) {
    try {
      return parser.parse(currentQuery, database ? { database } : undefined);
    } catch (e) {
      err = err || e;
      ++i;
      currentQuery = currentQuery.substring(0, Math.max(currentQuery.lastIndexOf(' '), 0)).trim();
      if (currentQuery.length === 0) break;
      logger.extend('info')('retry(%d) with\n%s', i, currentQuery);
    }
  }
  throw err;
}
export default class IntellisensePlugin<T extends ILanguageServer> implements ILanguageServerPlugin<T> {
  private server: T;

  private getQueryData = async (params: Arg0<Arg0<ILanguageServer['onCompletion']>>) => {
    const [ activeConnections, lastUsedId ] = await Promise.all<
      {[k: string]: Connection },
      string
    >([
      connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {}),
      connectionStateCache.get(LAST_USED_ID_KEY) as Promise<string>,
    ])
    const { textDocument, position } = params;
    log.extend('info')('completion requested %O', position);
    const doc = this.server.docManager.get(textDocument.uri);

    const { currentQuery, currentQueryTilCursor } = getDocumentCurrentQuery(doc, position);
    log.extend('debug')('got current query:\n%s', currentQuery);
    const queryTokens = doc.getText(Range.create(Math.max(0, position.line - 5), 0, position.line, position.character)).replace(/[\r\n|\n]+/g, ' ').split(/;/g).pop().split(/\s+/g);
    const currentWord = (queryTokens.pop() || '').trim().toUpperCase();
    const prevWord = (queryTokens.pop() || '').trim().toUpperCase();
    const prev2Words = `${(queryTokens.pop() || '')} ${prevWord}`.trim().toUpperCase();
    log.extend('debug')('check prevWord %s', prevWord);

    const conn = activeConnections[lastUsedId];
    let completionDialect: string;

    // @TODO
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
      currentWord,
      currentQuery,
      currentQueryTilCursor,
      prevWord,
      prev2Words,
      completionDialect,
      conn
    }
  }

  private getCompletionsFromQueryParser = async ({
    currentQuery,
    completionDialect,
    conn,
  }) => {
    let completions = [];
    let suggestColumns = false;
    let usedTables: Select['from'] = [];
    let staticCompletions = {};
    try {
      if (conn)
        staticCompletions = await conn.getStaticCompletions();
    } catch (_) {}

    try {
      const { ast } = parseRetry(currentQuery, completionDialect, 5);
      usedTables = (ast as Select).from || [];
      log.extend('debug')('query ast parsed:\n%O', JSON.stringify(ast));
    } catch (error) {
      suggestColumns = suggestColumns || (error.message && error.message.toString().indexOf('A-Za-z0-9_') !== -1);
      if (error.expected && error.expected.length > 0) {
        const added = {};
        error.expected.forEach(exp => {
          let label: string = null;
          if (exp.text) {
            label = exp.text;
          }
          if (label === null || added[label]) return;
          added[label] = true;
          completions.push(<CompletionItem>(staticCompletions[label] || {
            label,
            filterText: label,
            sortText: IS_WORD_REGEX.test(label) ? `3:${label}` : `4:${label}`,
            kind: CompletionItemKind[exp.type.charAt(0) + exp.type.substr(1)]
          }));
          delete staticCompletions[label];
        })
      };
    }

    completions.push(...Object.values(staticCompletions));

    return {
      completions,
      suggestColumns,
      usedTables
    }
  }

  private getTableCompletions = async ({ currentWord, conn }: { conn: Connection; currentWord: string }) => {
    const tables = await conn.searchItems(ContextValue.TABLE, currentWord) as any;
    log.extend('info')('got %d table completions', tables.length);
    if (tables.length  > 0) {
      return tables.map(t => TableCompletionItem(t, 0));
    }
    return [];
  }

  private getColumnCompletions = async ({ currentWord, conn, usedTables }: { conn: Connection; currentWord: string; usedTables: Select['from'] }) => {
    const tables = usedTables.map((t: any) => (<NSDatabase.ITable>{ label: t.table  || undefined, database: t.database || undefined }));
    const columns = await conn.searchItems(ContextValue.COLUMN, currentWord, {
      tables
    }) as any;
    log.extend('info')('got %d column completions', columns.length);
    if (columns.length  > 0) {
      return columns.map(c => TableColumnCompletionItem(c, { driver: conn.getDriver(), addTable: usedTables.length > 1 }));
    }
    return [];
  }

  private onCompletion: Arg0<ILanguageServer['onCompletion']> = async params => {
    let completionsMap  = {
      query: [],
      tables: [],
      columns: []
    };
    let hasColumnSuggestions = false;
    try {
      const {
        currentWord,
        currentQuery,
        prevWord,
        prev2Words,
        completionDialect,
        conn
      } = await this.getQueryData(params);


      const { completions: queryCompletions, suggestColumns, usedTables } = await this.getCompletionsFromQueryParser({ currentQuery, completionDialect, conn });
      completionsMap.query = queryCompletions;
      if (!conn) {
        log.extend('info')('no active connection completions count: %d', completionsMap.query.length);
        return completionsMap.query;
      };
      hasColumnSuggestions = suggestColumns;

      const [ tableCompletions, columnCompletions ] = await Promise.all([
        (tablePrevWords.includes(prevWord) || tablePrevWords.includes(prev2Words)) ? this.getTableCompletions({ currentWord, conn }) : [],
        (columnPrevWords.includes(prevWord) || columnPrevWords.includes(prev2Words)) ? this.getColumnCompletions({ currentWord, conn, usedTables }) : [],
      ]);
      completionsMap.tables = tableCompletions;
      completionsMap.columns = columnCompletions;
    } catch (error) {
      log.extend('error')('got an error:\n %O', error);
    }
    let completions = [];
    if (hasColumnSuggestions) {
      completions = completionsMap.columns.concat(completionsMap.tables).concat(completionsMap.query);
    } else {
      completions = completionsMap.tables.concat(completionsMap.query).concat(completionsMap.columns);
    }
    log.extend('debug')('total completions %d', completions.length);
    return completions;
  }

  public register(server: T) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          workDoneProgress: true,
          triggerCharacters: [' ', '.', '(', '`', '\'']
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);
  }
}
