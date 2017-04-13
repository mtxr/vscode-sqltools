export default class EnvironmentException extends Error {
  public name = 'EnvironmentError';
  constructor(public message: string) {
    super(message || 'Could not retrived env vars');
  }
}
