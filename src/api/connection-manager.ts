import Logger from './logger';
import ConfigManager = require('./config-manager');
import Connection from './connection';
import { ConnectionCredentials } from './interface/connection-credentials';
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
