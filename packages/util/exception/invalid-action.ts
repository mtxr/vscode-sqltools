import GenericError from './generic';

export class InvalidActionError extends GenericError {
  constructor(message: string = 'Invalid Action!') {
    super(message);
  }
}
