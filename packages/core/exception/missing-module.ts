import GenericException from './generic';
export class MissingModule extends GenericException {
  constructor(public moduleName: string, public moduleVersion: string = 'latest') {
    super(`Missing module "${moduleName}@${moduleVersion}". Need to install and compile.`);
  }
}

export default MissingModule;
