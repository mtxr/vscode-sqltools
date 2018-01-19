export default interface ConnectionCredentials {
  name: string;
  server: string;
  port: number;
  database?: string;
  username: string;
  password?: string;
  askForPassword?: boolean;
  dialect: string;
  connectionTimeout: string;
}
