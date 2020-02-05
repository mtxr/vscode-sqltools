import GenericError from '@sqltools/util/exception/generic';
export class MethodNotImplementedError extends GenericError {
  constructor(message: string = 'Method not implemented!') {
    super(message);
  }
}

export default MethodNotImplementedError;
