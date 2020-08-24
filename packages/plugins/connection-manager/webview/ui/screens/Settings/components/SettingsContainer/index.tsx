import React from 'react';
import { Container } from '@material-ui/core';
import DriverSelectorStepWidget from '../DriverSelectorStepWidget';
import SettingsFormStepWidget from '../SettingsFormStepWidget';
import ConnectionCreatedStepWidget from '../ConnectionCreatedStepWidget';
import Header from '../Header';
import Loading from '../../../../components/Loading';
import useLoading from '../../hooks/useLoading';
import styles from '../../../../sass/generic.m.scss';

const SettingsContainer = () => {
  const loading = useLoading();

  return (
    <>
      <Container
        maxWidth='md'
        className={loading ? styles.blurActive : styles.blur}
      >
        <Header />
        <DriverSelectorStepWidget />
        <SettingsFormStepWidget />
        <ConnectionCreatedStepWidget />
      </Container>
      {loading && <Loading />}
    </>
  );
};

export default SettingsContainer;
