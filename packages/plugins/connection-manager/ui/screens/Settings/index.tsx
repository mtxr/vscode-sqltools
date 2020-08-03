import React from 'react';
import { render } from 'react-dom';
import SettingsScreen from './Screen';
import Themed from '../../components/Themed';
import '../../sass/jsonschema.form.scss';

render(
  <Themed>
    <SettingsScreen />
  </Themed>,
  document.getElementById('app-root')
);