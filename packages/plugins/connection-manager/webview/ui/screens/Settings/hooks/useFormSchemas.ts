import useSettingsContext from './useSettingsContext';

export default function useFormSchemas() {
  const { schema, uiSchema } = useSettingsContext();

  return { schema, uiSchema };
}
