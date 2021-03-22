import React from 'react';
import { render } from 'react-dom';
import SettingsContainer from './components/SettingsContainer';
import Themed from '../../components/Themed';
import { SettingsProvider } from './context/SettingsContext';
import '../../sass/jsonschema.form.scss';

render(
  <Themed>
    <SettingsProvider>
      <SettingsContainer />
    </SettingsProvider>
  </Themed>,
  document.getElementById('app-root')
);
