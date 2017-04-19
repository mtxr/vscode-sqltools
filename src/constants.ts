// tslint:disable:no-reference
// tslint:disable:no-var-requires

/// <reference path="./../node_modules/@types/node/index.d.ts" />

import * as path from 'path';
import { Utils } from './api';

const  pkg = require('./../package.json');

export default class Constants {
  public static version      = `v${pkg.version}`;
  public static extNamespace = 'SQLTools';
  public static outputChannelName = Constants.extNamespace;
  public static bufferName   = path.join(Utils.getHome(), 'SQLTools.buffer.sql');
}
