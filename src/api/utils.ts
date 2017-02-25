import { formatSql } from 'sql-formatter';
import { EnvironmentError } from './errors';

/**
 * Get user home path
 *
 * @throws {EnvironmentError} Can't find user path from wnv
 * @returns {string} Returns user path as string
 */
function getHome(): string {
  if (process.env.HOME || process.env.USERPROFILE)
    return (process.env.HOME || process.env.USERPROFILE);
  throw new EnvironmentError('Could not find user home path');
}

export { 
  formatSql,
  getHome
};
