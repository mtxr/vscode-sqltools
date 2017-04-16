export default class EnvironmentException extends Error {
  public name = 'EnvironmentError';
  constructor(message: string = null) {
    super(message || 'Could not retrived env vars');
  }
}
