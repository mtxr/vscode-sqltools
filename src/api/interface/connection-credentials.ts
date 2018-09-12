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
  fb_charset: string;
  fb_lowercase_keys?: boolean;
  fb_role: string;
  fb_pageSize: number;
  
}
