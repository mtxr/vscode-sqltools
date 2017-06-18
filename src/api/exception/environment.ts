export default class EnvironmentException extends Error {
  public name = 'EnvironmentError';
  constructor(message: string = 'Could not retrived env vars') {
    super(message);
  }
}
