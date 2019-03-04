import { TextEditor } from 'vscode';
import { window } from 'vscode';
import { workspace } from 'vscode';
import { DismissedException } from '@sqltools/core/exception';
import { SnippetString } from 'vscode';
import Utils from './utils';
import { QuickPickItem, QuickPickOptions, QuickPick } from 'vscode';

export async function getOrCreateEditor(forceCreate = false): Promise<TextEditor> {
  if (forceCreate || !window.activeTextEditor) {
    const doc = await workspace.openTextDocument({ language: 'sql' });
    await window.showTextDocument(doc, 1, false);
  }
  return window.activeTextEditor;
}

export async function getSelectedText(action = 'proceed', fullText = false) {
  const editor = await getOrCreateEditor();
  const query = editor.document.getText(fullText ? undefined : editor.selection);
  if (Utils.isEmpty(query)) {
    window.showInformationMessage(`Can't ${action}. You have selected nothing.`);
    throw new DismissedException();
  }
  return query;
}
export async function insertText(text: string, forceCreate = false) {
  const editor = await getOrCreateEditor(forceCreate);
  editor.edit(edit => {
    editor.selections.forEach(cursor => edit.insert(cursor.active, text));
  });
}

export async function insertSnippet(text: string, forceCreate = false) {
  const editor = await getOrCreateEditor(forceCreate);
  return editor.insertSnippet(new SnippetString(text));
}

export async function readInput(prompt: string, placeholder?: string) {
  const data = await window.showInputBox({ prompt, placeHolder: placeholder || prompt });
  if (Utils.isEmpty(data)) throw new DismissedException();
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
