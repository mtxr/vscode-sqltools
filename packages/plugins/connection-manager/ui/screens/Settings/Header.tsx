import React from 'react';
import { Step, totalSteps } from './lib/steps';
import { SettingsScreenState } from './interfaces';
import style from './style.m.scss';

const Header = ({ step, driver, saved, goTo }: {
  step: Step;
  driver: SettingsScreenState['driver'];
  saved: boolean;
  goTo: (step: number) => void;
}) => (<h3 className={style.header}>
  Connection Assistant
  <small>
    {step - 1 >= Step.CONNECTION_TYPE
      && <a onClick={() => goTo(step - 1)}>{'<'}</a>}
      Step {step}/{totalSteps}
    {step + 1 <= Step.CONNECTION_CREATED
      && driver
      && (step + 1 !== Step.CONNECTION_CREATED || saved)
      && <a onClick={() => goTo(step + 1)}>{'>'}</a>}
  </small>
</h3>);

export default Header;