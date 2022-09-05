import React from 'react';
import styles from './styles.m.scss';
import Button from '../../../../components/Button';
import useContextAction, { openMessagesConsole } from '../../../Results/hooks/useContextAction';


const FooterActions = () => {
  const { openResults, reRunQuery, exportResults } = useContextAction();
  return (
    <footer className={styles.footer}>
      <Button onClick={openMessagesConsole}>Console</Button>
      <Button onClick={reRunQuery}>Re-Run Query</Button>
      <Button onClick={exportResults}>Export</Button>
      <Button onClick={openResults}>Open</Button>
    </footer>
  );
};

export default FooterActions;
