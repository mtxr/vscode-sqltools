class EnvironmentError extends Error {
  public name = 'EnvironmentError';
  constructor(public message: string) {
    super(message || "");
  }
}

export {
  EnvironmentError
}
