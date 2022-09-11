import React from 'react';
import { lastStep } from '../../lib/steps';
import style from './style.m.scss';
import useStep from '../../hooks/useStep';

const Header = () => {
  const { step, next, prev } = useStep();
  return (
    <h3 className={style.header}>
      Connection Assistant
      <small>
        {prev && <a tabIndex={0} onClick={prev} onKeyPress={prev}>{'<'}</a>}
        Step {step}/{lastStep}
        {next && <a tabIndex={0} onClick={next} onKeyPress={next}>{'>'}</a>}
      </small>
    </h3>
  );
};

export default Header;
