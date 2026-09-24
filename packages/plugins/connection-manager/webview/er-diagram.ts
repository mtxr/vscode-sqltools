import WebviewProvider from '@sqltools/vscode/webview-provider';
import { DISPLAY_NAME } from '@sqltools/util/constants';
import { NSDatabase } from '@sqltools/types';
import { ViewColumn } from 'vscode';

export interface ERDiagramData {
  tables: NSDatabase.ITable[];
  columns: { [tableName: string]: NSDatabase.IColumn[] };
  foreignKeys: NSDatabase.IForeignKey[];
  schemaName: string;
  connectionName: string;
}

export const ERDiagramAction = {
  RESPONSE_ER_DATA: 'RESPONSE:ER_DATA' as const,
  NOTIFY_VIEW_READY: 'NOTIFY:VIEW_READY' as const,
};

export default class ERDiagramWebview extends WebviewProvider<ERDiagramData> {
  protected id: string = 'ERDiagram';
  protected title: string = `${DISPLAY_NAME} ER Diagram`;

  protected cssVariables = {};

  protected messagesHandler = (_msg: { action: string; payload: any }) => {
    // Handle messages from the webview if needed
  };

  public updateDiagram(data: ERDiagramData) {
    this.title = `ER Diagram: ${data.connectionName} - ${data.schemaName}`;
    this.updatePanelName();
    this.sendMessage(ERDiagramAction.RESPONSE_ER_DATA, data);
  }

  public show() {
    this.whereToShow = ViewColumn.One;
    super.show();
  }

  whereToShow = ViewColumn.One;
}
