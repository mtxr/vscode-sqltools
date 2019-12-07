import GenericError from './generic';

export class DismissedError extends GenericError {
  public dontNotify: boolean = true;
  constructor(message: string = 'Dialog dismissed. This is not an error.') {
    super(message);
  }
}

export default DismissedError;
