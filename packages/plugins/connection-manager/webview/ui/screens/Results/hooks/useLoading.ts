import useResultsContext from './useResultsContext';

export default function useLoading() {
  const { loading } = useResultsContext();

  return loading;
}
