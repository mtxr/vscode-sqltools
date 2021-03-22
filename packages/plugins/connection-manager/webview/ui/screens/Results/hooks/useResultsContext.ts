import { useContext } from 'react';
import { ResultsContext } from '../context/ResultsContext';

const useResultsContext = () => {
  const context = useContext(ResultsContext);
  return context;
}

export default useResultsContext;