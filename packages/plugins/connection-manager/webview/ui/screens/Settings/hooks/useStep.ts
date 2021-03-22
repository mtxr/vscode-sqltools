import { useCallback, useMemo } from 'react';
import { Step, lastStep } from '../lib/steps';
import useSettingsContext from './useSettingsContext';

export default function useStep() {
  const { step, setState, saved, driver } = useSettingsContext();

  const goTo = useCallback((newStep: Step) => setState({ step: newStep }), []);

  const { prev, next } = useMemo(() => {
    let nextStep = step + 1;
    let prevStep = step - 1;

    if (prevStep <= 0) {
      prevStep = null;
    }

    if (nextStep > lastStep || !driver || (driver && !saved)) {
      nextStep = null;
    }
    const prev = (prevStep && (() => goTo(prevStep))) || undefined;
    const next = (nextStep && (() => goTo(nextStep))) || undefined;
    return { next, prev };
  }, [step, saved]);

  return { step, goTo, prev, next };
}
