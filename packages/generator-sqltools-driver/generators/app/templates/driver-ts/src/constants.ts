import { IDriverAlias } from '@sqltools/types';

/**
 * Aliases for yout driver. EG: PostgreSQL, PG, postgres can all resolve to your driver
 */
export const DRIVER_ALIASES: IDriverAlias[] = [
  { displayName: '<%= displayName %>', value: '<%= displayName %>'},
];
