/* eslint-disable @typescript-eslint/no-var-requires */
import { IConfig } from '@sqltools/types';

let Config: IConfig;
if (process.env.PRODUCT === 'ext') {
  Config = require('./vscode').default;
} else {
  Config = require('./generic').default;
}

export default Config;
