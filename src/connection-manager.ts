import {
  WorkspaceConfiguration,
} from 'vscode';
import { ConnectionCredentials } from './api/interface/connection-credentials';
export default class ConnectionManager {
  private connections: ConnectionCredentials[] = [];
  constructor(public extConfig: WorkspaceConfiguration) {
    this.loadConnections();
  }
  public getConnections(): ConnectionCredentials[] {
    return this.connections;
  }
  public loadConnections(): this {
    const connectionsConfig = this.extConfig.get('connections', []);
    this.connections = connectionsConfig.map((credentials): ConnectionCredentials => {
      return credentials as ConnectionCredentials;
    });
    return this;
  }

  public getConnection(connection: string|number) {
    if (typeof connection === 'number') {
      return this.connections[connection];
    }
    return this.connections.find((conn) => connection === conn.name);
  }
}
