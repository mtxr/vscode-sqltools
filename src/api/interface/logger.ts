export default interface LoggerInterface {
  logging?: boolean;
  level?: any;
  writer?: any;
  isLogging?(): boolean;
  log?(message: string, ...data: any[]);
  debug?(message: string, ...data: any[]);
  error(message: string, ...data: any[]);
  info(message: string, ...data: any[]);
  warn(message: string, ...data: any[]);
}

