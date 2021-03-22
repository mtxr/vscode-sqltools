import { useCallback } from 'react';
import useSettingsContext from './useSettingsContext';

export default function useDriver() {
  const { driver, installedDrivers, setState } = useSettingsContext();

  const setDriver = useCallback(
    (selectedDrier: typeof driver) => setState({ driver: selectedDrier }),
    [installedDrivers, installedDrivers.length, driver]
  );

  return { driver, installedDrivers, setDriver };
}
