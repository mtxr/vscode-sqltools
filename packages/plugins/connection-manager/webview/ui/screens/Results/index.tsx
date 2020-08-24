import React from 'react';
import { render } from 'react-dom';
import ResultsContainer from './Main';
import Themed from '../../components/Themed';

render(
  <Themed>
    <ResultsContainer />
  </Themed>,
  document.getElementById('app-root')
);
