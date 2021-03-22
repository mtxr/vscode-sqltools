import useSettingsContext from './useSettingsContext';

export default function useFormData() {
  const { formData } = useSettingsContext();

  return formData;
}
