import GenericError from './generic';

export class InvalidActionError extends GenericError {
  constructor(message = 'Invalid Action!') {
    super(message);
  }
}
