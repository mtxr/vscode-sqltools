import SQLToolsException from './sqltools';

export default class DismissedException extends SQLToolsException {
  public swallowError: boolean = true;
  constructor(message: string = 'Dialog dismissed. This is not an error.') {
    super(message);
  }
}
