import GenericException from './generic';
export class MissingModuleException extends GenericException {
  constructor(public moduleName: string, public moduleVersion: string = 'latest') {
    super(`Missing module "${moduleName}@${moduleVersion}". Need to install and compile.`);
  }
}

export default MissingModuleException;
