interface LoggerInterface {
  debug(message: string, ...data: any[]);
  error(message: string, ...data: any[]);
  info(message: string, ...data: any[]);
  warn(message: string, ...data: any[]);
}

export default LoggerInterface;
