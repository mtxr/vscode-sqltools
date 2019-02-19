import { SerializedConnection } from './interface';
import Connection from './connection';
import ConfigManager from './config-manager';
import { Telemetry, getDbId } from './utils';
export default class ConnectionManager {
  public static getConnections(telemetry: Telemetry): Connection[];
  public static getConnections(telemetry: Telemetry, serialized: boolean = false): (Connection | SerializedConnection)[] {
    const connectionsConfig = ConfigManager.get('connections', []) as any[];
    ConnectionManager.connections = connectionsConfig.map((credentials): Connection => {
      return new Connection(credentials, telemetry);
    });

    if (!serialized) return ConnectionManager.connections;

    return ConnectionManager.connections.map((c) => c.serialize());
  }

  public static getConnection(
    connectionId: string|number,
    telemetry: Telemetry,
    serialized: boolean = false,
  ): Connection | SerializedConnection {
    ConnectionManager.getConnections(telemetry);
    if (typeof connectionId === 'number') {
      return ConnectionManager.connections[connectionId];
    }
    const conn =  ConnectionManager.connections.find((c) => connectionId === getDbId(c.serialize()));
    if (!serialized) return conn;

    return conn.serialize();
  }
  private static connections: Connection[] = [];
}
