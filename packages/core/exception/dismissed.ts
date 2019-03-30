import GenericException from './generic';

export class DismissedException extends GenericException {
  public dontNotify: boolean = true;
  constructor(message: string = 'Dialog dismissed. This is not an error.') {
    super(message);
  }
}

export default DismissedException;
