import React from 'react';
import { render } from 'react-dom';
import Themed from '../../components/Themed';
import ERDiagramContainer from './components/ERDiagramContainer';

render(
  <Themed>
    <ERDiagramContainer />
  </Themed>,
  document.getElementById('app-root')
);
