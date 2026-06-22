import { IDriverAlias } from '@sqltools/types';

export const DRIVER_ID = 'KDB';
export const DRIVER_NAME = 'kdb+';

export const DRIVER_ALIASES: IDriverAlias[] = [
  { displayName: DRIVER_NAME, value: DRIVER_ID },
];
