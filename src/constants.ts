import * as path from 'path';
import { getHome } from './api';

const version             = 'v0.0.1';
const extensionNamespace = 'sqltools';

let bufferName =  path.join(getHome(),'SQLTools.buffer');

export {
    bufferName,
    version,
    extensionNamespace
}
