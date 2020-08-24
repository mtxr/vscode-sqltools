import React, { useCallback } from 'react';
import DriverIcon from '../../../../components/DriverIcon';
import Button from '../../../../components/Button';
import Form, { FormProps, IChangeEvent, ISubmitEvent } from '@rjsf/core';
import Syntax from '../../../../components/Syntax';
import FileInput from '../../../../components/FileInput';
import Message from '../../../../components/Message';
import style from './style.m.scss';
import { Step } from '../../lib/steps';
import useStep from '../../hooks/useStep';
import useFormData from '../../hooks/useFormData';
import useResponseMessages from '../../hooks/useResponseMessages';
import useDriver from '../../hooks/useDriver';
import useFormSchemas from '../../hooks/useFormSchemas';
import useContextAction from '../../hooks/useContextAction';
import { IConnection } from '@sqltools/types';
import sendMessage from '../../../../lib/messages';
import { UIAction } from '../../../../../../actions';

const SettingsFormStepWidget = () => {
  const { step } = useStep();
  const { driver } = useDriver();
  const formData = useFormData();
  const { externalMessage, externalMessageType } = useResponseMessages();
  const { schema = {}, uiSchema = {} } = useFormSchemas();
  const { setState } = useContextAction();

  const onSubmit = useCallback(
    ({ formData: data, errors }: ISubmitEvent<IConnection>) => {
      if (errors.length > 0) return;
      const { id: editId, ...connInfo } = data;
      setState({ loading: true }, () => {
        sendMessage(
          !editId
            ? UIAction.REQUEST_CREATE_CONNECTION
            : UIAction.REQUEST_UPDATE_CONNECTION,
          {
            editId,
            connInfo,
            globalSetting: false,
          }
        );
      });
    },
    [formData]
  );

  const onChange = useCallback(
    ({ formData: data }: IChangeEvent<IConnection>) => {
      setState({ formData: data });
    },
    []
  );

  const testConnection = useCallback(() => {
    setState({ loading: true }, () => {
      sendMessage(UIAction.REQUEST_TEST_CONNECTION, {
        connInfo: formData,
      });
    });
  }, [formData]);

  const openConnectionFile = useCallback(
    () => sendMessage(UIAction.REQUEST_OPEN_CONNECTION_FILE),
    []
  );

  if (step !== Step.CONNECTION_FORM) return null;
  return (
    <div className={style.formContainer}>
      <h5>Connection Settings</h5>
      <hr />
      <DriverIcon driver={driver} />
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        formData={formData}
        widgets={widgets}
        showErrorList={false}
        noHtml5Validate={true}
      >
        {externalMessage && (
          <div>
            <Message type={externalMessageType}>{externalMessage}</Message>
          </div>
        )}
        <SettingsFormStepWidget.Footer
          allowOpen={!!formData.id}
          testConnection={testConnection}
          openConnectionFile={openConnectionFile}
        />
      </Form>
      {process.env.NODE_ENV !== 'production' && (
        <div>
          <blockquote> -- DEV ONLY -- </blockquote>
          <a onClick={() => location.reload()}>Realod webview</a>
          <Syntax code={formData} language='json' />
        </div>
      )}
    </div>
  );
};

SettingsFormStepWidget.Footer = ({
  testConnection,
  allowOpen,
  openConnectionFile,
}) => (
  <footer className={style.footer}>
    <Button bg='var(--vscode-list-highlightForeground)' type='submit'>
      Save Connection
    </Button>
    <Button onClick={testConnection} float='right' type='button'>
      Test Connection
    </Button>
    {allowOpen && <a onClick={openConnectionFile}>Open settings</a>}
  </footer>
);

const widgets: FormProps<any>['widgets'] = {
  FileWidget: FileInput,
};

export default SettingsFormStepWidget;
