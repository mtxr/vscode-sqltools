import { Logger } from './api';
import ConfigManager = require('./api/config-manager');
import { ConnectionCredentials } from './api/interface/connection-credentials';
import Connection from './connection';
export default class ConnectionManager {
  public static getConnections(logger: Logger): Connection[];
  public static getConnections(logger: Logger, serialized: boolean = false): any[] {
    const connectionsConfig = ConfigManager.get('connections', []) as any[];
    ConnectionManager.connections = connectionsConfig.map((credentials): Connection => {
      return new Connection(credentials, logger);
    });

    if (!serialized) return ConnectionManager.connections;

    return ConnectionManager.connections.map((c) => c.serialize());
  }

  public static getConnection(connection: string|number, logger: Logger, serialized: boolean = false): Connection {
    ConnectionManager.getConnections(logger);
    if (typeof connection === 'number') {
      return ConnectionManager.connections[connection];
    }
    const conn =  ConnectionManager.connections.find((c) => connection === c.getName());
    if (!serialized) return conn;

    return conn.serialize();
  }
  private static connections: Connection[] = [];
}
