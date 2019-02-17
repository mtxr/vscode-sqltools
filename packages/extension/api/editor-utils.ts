import { TextEditor } from 'vscode';
import { window } from 'vscode';
import { workspace } from 'vscode';
import { DismissedException } from '@sqltools/core/exception';
import { SnippetString } from 'vscode';
import Utils from './utils';

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
  editor.edit((edit) => {
    editor.selections.forEach((cursor) => edit.insert(cursor.active, text));
  });
}

export async function insertSnippet(text: string, forceCreate = false) {
  const editor = await getOrCreateEditor(forceCreate);
  return editor.insertSnippet(new SnippetString(text));
}
