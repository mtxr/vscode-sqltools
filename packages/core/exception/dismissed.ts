import GenericException from './generic';

export default class DismissedException extends GenericException {
  public swallowError: boolean = true;
  constructor(message: string = 'Dialog dismissed. This is not an error.') {
    super(message);
  }
}
