import useSettingsContext from './useSettingsContext';

export default function useLoading() {
  const { loading } = useSettingsContext();

  return loading;
}
