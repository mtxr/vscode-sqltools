import GenericError from './generic';

export class DismissedError extends GenericError {
  public dontNotify = true;
  constructor(message = 'Dialog dismissed. This is not an error.') {
    super(message);
  }
}

export default DismissedError;
