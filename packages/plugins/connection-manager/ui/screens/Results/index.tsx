import React from 'react';
import { render } from 'react-dom';
import Screen from './Main';
import Themed from '../../components/Themed';

render(<Themed><Screen /></Themed>, document.getElementById('app-root'));