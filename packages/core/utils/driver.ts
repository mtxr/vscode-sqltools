import { DatabaseDriver } from '../interface/driver';

export const getIconPathForDriver = (driver: DatabaseDriver, iconType: 'default' | 'active' | 'inactive' = 'default') => {
  return `icons/driver/${driver.toLowerCase().replace(/[^a-z0-2]/g, '')}/${iconType}.png`;
}