import useResultsContext from './useResultsContext';

export default function useCurrentResult() {
  const { resultTabs, activeTab } = useResultsContext();

  const result = resultTabs[activeTab];

  const options = {
    requestId: result?.requestId,
    resultId: result?.resultId,
    baseQuery: result?.baseQuery,
    connId: result?.connId,
  };

  return { result, options };
}
