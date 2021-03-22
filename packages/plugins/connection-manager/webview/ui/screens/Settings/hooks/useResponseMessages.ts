import useSettingsContext from './useSettingsContext';

export default function useResponseMessages() {
  const { externalMessage, externalMessageType } = useSettingsContext();

  return { externalMessage, externalMessageType };
}
