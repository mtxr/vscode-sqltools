import EnvironmentException from './../exception/environment';

let home: string;

/**
   * Get user home path
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
export function getHome(): string {
  if (home) return home;

  if (process && process.env && (process.env.HOME || process.env.USERPROFILE))
    return (home = process.env.HOME || process.env.USERPROFILE);
  throw new EnvironmentException('Could not find user home path');
}
