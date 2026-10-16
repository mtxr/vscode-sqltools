import * as vscode from 'vscode';
import { SQLNotebookSerializer } from './serializer';
import { SQLNotebookController } from './controller';

let notebookController: SQLNotebookController | undefined;

export function registerSQLNotebook(context: vscode.ExtensionContext): void {
  // Register the notebook serializer
  const notebookType = 'sqltools-notebook';
  const serializer = new SQLNotebookSerializer();
  
  context.subscriptions.push(
    vscode.workspace.registerNotebookSerializer(notebookType, serializer)
  );

  // Register the notebook controller
  notebookController = new SQLNotebookController();
  
  // Add to subscriptions for proper cleanup
  context.subscriptions.push({
    dispose: () => {
      if (notebookController) {
        notebookController.dispose();
        notebookController = undefined;
      }
    }
  });

  console.log('SQLTools Notebook feature registered successfully');
}

export function deactivateSQLNotebook(): void {
  if (notebookController) {
    notebookController.dispose();
    notebookController = undefined;
  }
} 