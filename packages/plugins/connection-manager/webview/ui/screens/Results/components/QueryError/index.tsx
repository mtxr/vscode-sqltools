import React from 'react';
import ErrorIcon from '../../../../components/Icons/ErrorIcon';
import { ResultsScreenState } from '../../interfaces';
import FooterActions from '../FooterActions';
import styles from './style.m.scss';

const QueryError = ({ messages }: Pick<ResultsScreenState['resultTabs'][number], 'messages'>) => {
  return (
    <div className={styles.container}>
      <ErrorIcon />
      <main>
        Query with errors. Please, check the error below.
        {messages.length && <pre>{messages.map(m => (m as any).message || m.toString()).join('\n')}</pre>}
      </main>
      <FooterActions />
    </div>
  );
}

export default QueryError;
