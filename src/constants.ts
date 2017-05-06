// tslint:disable:no-reference
// tslint:disable:no-var-requires

/// <reference path="./../node_modules/@types/node/index.d.ts" />

import * as path from 'path';
import { Utils } from './api';

const  pkg = require('./../package.json');

export default class Constants {
  public static version      = `v${pkg.version}`;
  public static extName = pkg.displayName;
  public static extNamespace = Constants.extName;
  public static outputChannelName = Constants.extName;
  public static bufferName   = path.join(Utils.getHome(), `${Constants.extName}.buffer.sql`);
}
