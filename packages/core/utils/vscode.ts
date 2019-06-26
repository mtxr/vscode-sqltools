import {
  TextEditor,
  window,
  workspace,
  SnippetString,
} from 'vscode';
import { QuickPickItem, QuickPickOptions, QuickPick, env, commands, Uri } from 'vscode';
import { DismissedException } from '@sqltools/core/exception';
import { isEmpty } from '@sqltools/core/utils';

export async function getOrCreateEditor(forceCreate = false): Promise<TextEditor> {
  if (forceCreate || !window.activeTextEditor || !window.activeTextEditor.viewColumn) {
    const doc = await workspace.openTextDocument({ language: 'sql' });
    await window.showTextDocument(doc, 1, false);
  }
  const editor = window.activeTextEditor;
  return editor;
}

export async function getSelectedText(action = 'proceed', fullText = false) {
  const editor = await getOrCreateEditor();
  const query = editor.document.getText(fullText ? undefined : editor.selection);
  if (isEmpty(query)) {
    window.showInformationMessage(`Can't ${action}. You have selected nothing.`);
    throw new DismissedException();
  }
  return query;
}
export async function insertText(text: string | SnippetString, forceCreate = false, insertAsText = false) {
  const editor = await getOrCreateEditor(forceCreate);
  if (typeof text === 'string' && insertAsText) {
    return void Promise.all(editor.selections.map(cursor => editor.edit(e => e.insert(cursor.active, text))));
  }
  await Promise.all(editor.selections.map(cursor => editor.insertSnippet(text instanceof SnippetString ? text : new SnippetString(`\${1:${text}}$0`), cursor.active)));
}

export async function readInput(prompt: string, placeholder?: string, value?: string) {
  const data = (await window.showInputBox({ prompt, placeHolder: placeholder || prompt, value }));
  if (isEmpty(data)) throw new DismissedException();
  return data;
}

/**
 * @deprecated Will be removed in newer versions.
 */
async function quickPickOldApi(options: QuickPickItem[], prop?: string): Promise<QuickPickItem | any> {
  const sel: QuickPickItem = await window.showQuickPick(options);
  if (!sel || (prop && !sel[prop])) throw new DismissedException();
  return prop ? sel[prop] : sel;
}

type ExtendedQuickPickOptions<T extends QuickPickItem = QuickPickItem | any> = Partial<
  QuickPickOptions & {
    title: QuickPick<T>['title'];
    placeHolderDisabled?: QuickPick<T>['placeholder'];
    buttons?: QuickPick<T>['buttons'];
  }
>;

export async function quickPick<T = QuickPickItem | any>(
  options: ((QuickPickItem & { value?: any }) | string)[],
  prop?: string,
  quickPickOptions?: ExtendedQuickPickOptions
): Promise<QuickPickItem | any> {
  const items =
    options.length > 0 && typeof options[0] === 'object'
      ? <QuickPickItem[]>options
      : options.map<QuickPickItem>(value => ({
          value,
          label: value.toString(),
        }));

  if (typeof window.createQuickPick !== 'function') return quickPickOldApi(items, prop);

  const qPick = window.createQuickPick();
  const sel = await new Promise<QuickPickItem | any>(resolve => {
    const { placeHolderDisabled, ...qPickOptions } = quickPickOptions || ({} as ExtendedQuickPickOptions);
    qPick.onDidHide(() => qPick.dispose());
    qPick.onDidChangeSelection((selection = []) => {
      qPick.hide();
      return resolve(qPickOptions.canPickMany ? selection : selection[0]);
    });
    qPick.onDidTriggerButton((btn: any) => {
      if (btn.cb) btn.cb();
      qPick.hide();
    });

    Object.keys(qPickOptions).forEach(k => {
      qPick[k] = qPickOptions[k];
    });
    qPick.items = items;
    qPick.enabled = items.length > 0;

    if (!qPick.enabled) qPick.placeholder = placeHolderDisabled || qPick.placeholder;

    qPick.title = `${qPick.title || 'Items'} (${items.length})`;

    qPick.show();
  });
  if (!sel || (prop && !sel[prop])) throw new DismissedException();
  return <T>(prop ? sel[prop] : sel);
}

export function openExternal(url: string) {
  let uri = Uri.parse(url);
  if (uri.query && /http/.test(uri.scheme)) {
    uri = uri.with({ query: uri.query.replace(/\n/g, encodeURI('\n'))});
  }
  if (env && typeof (env as any).openExternal === 'function') {
    return (env as any).openExternal(uri);
  }
  if (env && typeof (env as any).open === 'function') {
    return (env as any).open(uri);
  }

  return commands.executeCommand('vscode.open', uri);
}
