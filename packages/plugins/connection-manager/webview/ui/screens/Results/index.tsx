import React from 'react';
import { render } from 'react-dom';
import ResultsContainer from './components/ResultsContainer';
import Themed from '../../components/Themed';
import { ResultsProvider } from './context/ResultsContext';

render(
  <Themed>
    <ResultsProvider>
      <ResultsContainer />
    </ResultsProvider>
  </Themed>,
  document.getElementById('app-root')
);
