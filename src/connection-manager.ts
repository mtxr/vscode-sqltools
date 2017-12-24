import * as ConfigManager from './api/config-manager';
import { ConnectionCredentials } from './api/interface/connection-credentials';
export default class ConnectionManager {
  public static getConnections(): ConnectionCredentials[] {
    const connectionsConfig = ConfigManager.get('connections', []) as any[];
    ConnectionManager.connections = connectionsConfig.map((credentials): ConnectionCredentials => {
      return credentials as ConnectionCredentials;
    });
    return ConnectionManager.connections;
  }

  public static getConnection(connection: string|number) {
    ConnectionManager.getConnections();
    if (typeof connection === 'number') {
      return ConnectionManager.connections[connection];
    }
    return ConnectionManager.connections.find((conn) => connection === conn.name);
  }
  private static connections: ConnectionCredentials[] = [];
}
