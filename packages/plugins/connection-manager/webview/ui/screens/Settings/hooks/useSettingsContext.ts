import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  return context;
}

export default useSettingsContext;