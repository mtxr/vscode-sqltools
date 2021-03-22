import useResultsContext from './useResultsContext';
import { useCallback, useMemo } from 'react';

export default function useTabs() {
  const { setState, activeTab, resultTabs } = useResultsContext();

  const toggleTab = useCallback((value: number) => setState({ activeTab: value }), [setState, activeTab]);

  const tabs = useMemo(() => resultTabs.map(r => r.label || r.query), [resultTabs]);

  return { activeTab, tabs, showTabs: tabs.length > 1, toggleTab };
}
