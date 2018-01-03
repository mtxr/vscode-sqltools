// tslint:disable:no-var-requires
/// <reference path="./../node_modules/@types/node/index.d.ts" />

import path = require('path');
import { Utils } from './api';

const  pkg = require('./../package.json');

export default class Constants {
  public static gaCode = process.env.NODE_ENV !== 'development' ? 'UA-110380775-2' : 'UA-110380775-1';
  public static version  = `v${pkg.version}`;
  public static extName = pkg.displayName;
  public static extNamespace = Constants.extName;
  public static outputChannelName = Constants.extName;
  public static get bufferName(): string {
    return path.join(Utils.getHome(), `${Constants.extName}.buffer.sql`);
  }
}
