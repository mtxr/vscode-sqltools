import React from 'react';
import { Step, totalSteps } from './lib/steps';
import { SettingsScreenState } from './interfaces';

const Header = ({ step, driver, saved }: {
  step: Step;
  driver: SettingsScreenState['driver'];
  saved: boolean;
}) => (<h3>
  Connection Assistant
  <small style={{ float: 'right' }} className='stepper'>
    {step - 1 >= Step.CONNECTION_TYPE
      && <a onClick={() => this.goTo(step - 1)}>{'<'}</a>}
      Step {step}/{totalSteps}
    {step + 1 <= Step.CONNECTION_CREATED
      && driver
      && (step + 1 !== Step.CONNECTION_CREATED || saved)
      && <a onClick={() => this.goTo(step + 1)}>{'>'}</a>}
  </small>
</h3>);

export default Header;