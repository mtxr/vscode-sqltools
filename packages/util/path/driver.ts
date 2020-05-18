import { DatabaseDriver } from '@sqltools/types';

export const getIconPathForDriver = (driver: DatabaseDriver, iconType: 'default' | 'active' | 'inactive' = 'default') => {
  // @TODO
  return `icons/driver/${driver.toLowerCase().replace(/[^a-z0-2]/g, '')}/${iconType}.png`;
}