import SQLToolsException from './sqltools';
export default class EnvironmentException extends SQLToolsException {
  public name = 'EnvironmentError';
  constructor(message: string = 'Could not retrived env vars') {
    super(message);
  }
}
