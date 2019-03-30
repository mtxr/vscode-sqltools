import GenericException from '@sqltools/core/exception/generic';
export class MethodNotImplementedException extends GenericException {
  constructor(message: string = 'Method not implemented!') {
    super(message);
  }
}

export default MethodNotImplementedException;
