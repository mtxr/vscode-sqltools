import GenericException from './generic';

export class InvalidActionException extends GenericException {
  constructor(message: string = 'Invalid Action!') {
    super(message);
  }
}
