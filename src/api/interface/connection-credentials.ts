export interface ConnectionCredentials {
  name: string;
  server: string;
  port: number;
  database: string;
  username: string;
  password: string;
  passwordPath: string;
  dialect: string;
  connectionTimeout: string;
}
