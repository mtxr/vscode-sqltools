import { DismissedError } from '@sqltools/util/exception';
import { isEmpty } from '@sqltools/util/validation';
import { commands, env, SnippetString, TextEditor, Uri, window, workspace } from 'vscode';

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
    throw new DismissedError();
  }
  return query;
}
export async function insertText(text: string | SnippetString, forceCreate = false, insertAsText = false) {
  const editor = await getOrCreateEditor(forceCreate);
  if (typeof text === 'string' && insertAsText) {
    return void Promise.all(editor.selections.map(cursor => editor.edit(e => e.insert(cursor.active, text))));
  }
  await Promise.all(
    editor.selections.map(cursor =>
      editor.insertSnippet(text instanceof SnippetString ? text : new SnippetString(`\${1:${text}}$0`), cursor.active)
    )
  );
}

export async function readInput(prompt: string, placeholder?: string, value?: string) {
  const data = await window.showInputBox({ prompt, placeHolder: placeholder || prompt, value });
  if (isEmpty(data)) throw new DismissedError();
  return data;
}

export function openExternal(url: string) {
  let uri = Uri.parse(url);
  if (uri.query && /http/.test(uri.scheme)) {
    uri = uri.with({ query: uri.query.replace(/\n/g, encodeURI('\n')) });
  }
  if (env && typeof env.openExternal === 'function') {
    return env.openExternal(uri);
  }
  if (env && typeof env['open'] === 'function') {
    return env['open'](uri);
  }

  return commands.executeCommand('vscode.open', uri);
}
