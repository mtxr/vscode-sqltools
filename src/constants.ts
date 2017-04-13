import * as path from 'path';
import { Utils } from './api';

export default class Constants {
  public static version      = 'v0.1.2';
  public static extNamespace = 'SQLTools';
  public static outputChannelName = Constants.extNamespace;
  public static bufferName   = path.join(Utils.getHome(), 'SQLTools.buffer.sql');
}
