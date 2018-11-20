import GenericException from './generic';
export class EnvironmentException extends GenericException {
  public name = 'EnvironmentError';
  constructor(message: string = 'Could not retrived env vars') {
    super(message);
  }
}

export default EnvironmentException;
