import React from 'react';
import QueryTabs from '../QueryTabs';
import Table from '../Table';
import ViewContainer from '../ViewContainer';
import '../../../../sass/results.scss';
import Loading from '../../../../components/Loading';
import useResultsContext from '../../hooks/useResultsContext';

const ResultsContainer = () => {
  const { setState, loading } = useResultsContext();
  return (
    <ViewContainer>
      <QueryTabs />
      <Table setContextState={setState}  />
      {loading && <Loading />}
    </ViewContainer>
  );
};
export default ResultsContainer;
