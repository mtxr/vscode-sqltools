import {
  WorkspaceConfiguration,
} from 'vscode';
import * as ConfigManager from './api/config-manager';
import { ConnectionCredentials } from './api/interface/connection-credentials';
export default class ConnectionManager {
  private connections: ConnectionCredentials[] = [];
  constructor() {
    this.loadConnections();
  }
  public getConnections(): ConnectionCredentials[] {
    return this.connections;
  }
  public loadConnections(): this {
    const connectionsConfig = ConfigManager.get('connections', []) as any[];
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
