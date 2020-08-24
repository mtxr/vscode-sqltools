import { useCallback } from 'react';
import { UIAction } from '../../../../../actions';
import useSettingsContext from './useSettingsContext';

export default function useContextAction() {
  const { dispatch, setState } = useSettingsContext();

  const reset = useCallback(() => dispatch({ type: UIAction.REQUEST_RESET }), []);

  return { dispatch, setState, reset };
}
