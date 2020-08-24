import React, { useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Message from '../../../../components/Message';
import { CircularProgress } from '@material-ui/core';
import { DriverItem } from '../../../../components/DriverItem';
import useStep from '../../hooks/useStep';
import { Step } from '../../lib/steps';
import useDriver from '../../hooks/useDriver';
import { IDriver } from '../../interfaces';
import useContextAction from '../../hooks/useContextAction';
import sendMessage from '../../../../lib/messages';
import { UIAction } from '../../../../../../actions';
import useLoading from '../../hooks/useLoading';

const DriverSelectorStepWidget = () => {
  const { setState } = useContextAction();
  const { step } = useStep();
  const { installedDrivers, driver: selectedDriver } = useDriver();
  const loading = useLoading();

  const onSelectDriver = useCallback((driver: IDriver) => {
    if (!driver) {
      return setState({ loading: false, driver, formData: {} });
    }
    setState(
      { loading: true, driver, formData: { driver: driver.value } },
      () => {
        sendMessage(UIAction.REQUEST_DRIVER_SCHEMAS, {
          driver: driver.value,
        });
      }
    );
  }, []);

  if (step !== Step.CONNECTION_DRIVER_SELECTOR)  return null;

  return (
    <>
      <h5>Select your database driver</h5>
      <hr />
      <Container maxWidth='sm'>
        {installedDrivers.length > 0 && (
          <Grid container spacing={2} autoCapitalize='center'>
            {installedDrivers.map(driver => (
              <DriverItem
                key={driver.value}
                selected={selectedDriver && selectedDriver.value === driver.value}
                driver={driver}
                onSelect={() => onSelectDriver(driver)}
              />
            ))}
          </Grid>
        )}
        {!loading && installedDrivers.length === 0 && (
          <Grid
            style={{
              textAlign: 'center',
              height: '400px',
              justifyContent: 'space-evenly',
              flexDirection: 'column',
              display: 'flex',
              boxSizing: 'content-box',
            }}
          >
            <div>
              <Message>
                Couldn't find any drivers installed yet.
                <p>
                  <a
                    href={`command:workbench.extensions.search?${encodeURIComponent(
                      '"@tag:sqltools-driver"'
                    )}`}
                  >
                    Search VSCode marketplace
                  </a>
                </p>
              </Message>
            </div>
            <div>
              <CircularProgress size='20px' />
              <p>
                <strong>
                  Don't worry, we are still looking up for installedDrivers.
                  <br />
                  Try to install drivers before move forward.
                </strong>
              </p>
            </div>
          </Grid>
        )}
        {!loading && installedDrivers.length > 0 && (
          <Grid
            style={{
              textAlign: 'center',
              height: '120px',
              justifyContent: 'space-evenly',
              flexDirection: 'column',
              display: 'flex',
              boxSizing: 'content-box',
            }}
          >
            <p>
              <a
                href={`command:workbench.extensions.search?${encodeURIComponent(
                  '"@tag:sqltools-driver"'
                )}`}
              >
                Get more drivers
              </a>
            </p>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default DriverSelectorStepWidget;
