/* eslint-disable @typescript-eslint/no-var-requires */
import { ATelemetry } from '@sqltools/types';

let telemetry: ATelemetry;
if (process.env.PRODUCT === 'ext') {
  telemetry = require('./vscode').default;
} else {
  telemetry = require('./generic').default;
}

export default telemetry;
