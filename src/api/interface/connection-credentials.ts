export default interface ConnectionCredentials {
  name: string;
  server: string;
  port: number;
  database?: string;
  domain?: string;
  username: string;
  password?: string;
  askForPassword?: boolean;
  dialect: string;
  dialectOptions?: { encrypt: boolean };
  connectionTimeout?: number;
}
