import GenericError from './generic';
export class EnvironmentError extends GenericError {
  public name = 'EnvironmentError';
  constructor(message: string = 'Could not retrived env vars') {
    super(message);
  }
}

export default EnvironmentError;
