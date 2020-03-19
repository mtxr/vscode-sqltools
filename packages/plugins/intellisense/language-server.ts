import { CompletionItem, CompletionItemKind, Range } from 'vscode-languageserver';
// import { TableCompletionItem, TableColumnCompletionItem, TableCompletionItemFirst } from './models';
import { ILanguageServerPlugin, ILanguageServer, DatabaseDriver, ContextValue, NSDatabase, Arg0 } from '@sqltools/types';
import { getDocumentCurrentQuery } from './query';
import connectionStateCache, { LAST_USED_ID_KEY, ACTIVE_CONNECTIONS_KEY } from '../connection-manager/cache/connections-state.model';
import { Parser } from 'node-sql-parser';
import Connection from '@sqltools/language-server/connection';
import { TableCompletionItem } from './models';

const parser = new Parser();
const IS_WORD_REGEX = /^\w/g;
export default class IntellisensePlugin<T extends ILanguageServer> implements ILanguageServerPlugin<T> {
  private server: T;

  private onCompletion: Arg0<ILanguageServer['onCompletion']> = async params => {
    try {
      const [ activeConnections, lastUsedId ] = await Promise.all<
        {[k: string]: Connection },
        string
      >([
        connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {}),
        connectionStateCache.get(LAST_USED_ID_KEY) as Promise<string>,
      ])
      const { textDocument, position } = params;
      console.log('completion requested', position);
      const doc = this.server.docManager.get(textDocument.uri);

      const { currentQuery } = getDocumentCurrentQuery(doc, position);
      const conn = activeConnections[lastUsedId];
      let driver: string = conn ? conn.getDriver() : null;

      console.log('got current query', currentQuery);
      switch (driver) {
        case DatabaseDriver['AWS Redshift']:
          driver = DatabaseDriver.PostgreSQL;
          break;
        case DatabaseDriver.MSSQL:
          driver = 'transactsql';
          break;
        case DatabaseDriver.MySQL:
        case DatabaseDriver.MariaDB:
          break;
        default:
          driver = null;
      }
      const prevWords = doc.getText(Range.create(Math.max(0, position.line - 5), 0, position.line, position.character)).replace(/[\r\n|\n]+/g, ' ').split(/;/g).pop().split(/\s+/g);
      const currentPrefix = (prevWords.pop() || '').toLowerCase();
      const prevWord = (prevWords.pop() || '').toLowerCase();
      const completions: CompletionItem[] = [];
      console.log('check prevword', prevWord);
      try {
        const parsed = parser.parse(currentQuery, driver ? { database: driver } : undefined);
        console.log('parsed', JSON.stringify(parsed));
      } catch (error) {
        console.error(error.message);
        if (error.expected && error.expected.length > 0) {
          const added = {};
          error.expected.forEach(exp => {
            let label: string = null;
            if (exp.text) {
              label = exp.text;
            }
            if (label === null || added[label]) return;
            added[label] = true;
            completions.push(<CompletionItem>{
              label,
              filterText: label,
              sortText: IS_WORD_REGEX.test(label) ? `0:${label}` : `1:${label}`,
              kind: CompletionItemKind[exp.type.charAt(0) + exp.type.substr(1)]
            });
          })
        };
      }

      if (!lastUsedId || !activeConnections[lastUsedId]) {
        console.log('completion without conn', completions.length);
        return completions
      };
      switch (prevWord) {
        case 'from':
        case 'join':
          // suggest tables
          const tables: NSDatabase.ITable[] = await <any>conn.searchItems(ContextValue.TABLE, currentPrefix);
          console.log('got table', tables.length);
          if (tables.length  > 0)
            completions.push(...tables.map(t => TableCompletionItem(t, 0)));
        default:
          break;
      }
      console.log('found completions', completions.length);
      return completions;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public register(server: T) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          workDoneProgress: true,
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);
  }
}
