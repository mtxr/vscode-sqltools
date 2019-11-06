import React from 'react'
import { components } from 'docz-theme-default';
import styled from 'styled-components';

const OriginalEditor = components.editor;

const CodeTitleHeader: any = styled.div`
  background: ${(props: any) => props.theme.docz.colors.grayBg};
  margin-top: 30px;
  margin-bottom: -31px;
  padding: 4px 16px;
  margin-right: -2px;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &:after {
    content: '${(props: any) => props.language}';
    background: ${(props: any) => props.theme.docz.colors.blue};
    color: white;
    position: absolute;
    padding: 4px 16px;
    right: 0;
    top: 0;
    bottom: 0;
    align-items: center;
    display: flex;
    font-weight: bold;
  }
`;

const CodeTitleContainer = styled.div``;

const CodeTitle = (props: any) => (
  <CodeTitleContainer>
    <CodeTitleHeader language={props.language}>{props.title}</CodeTitleHeader>
    {props.children}
  </CodeTitleContainer>
);

const Editor = (props: any) => {
  if (props.children && props.children.props.title) {
    return (
      <CodeTitle title={props.children.props.title} language={props.children.props.className.replace('language-', '')}>
        <OriginalEditor {...props} readOnly={false} />
      </CodeTitle>
    );
  }
  return <OriginalEditor {...props} readOnly={false} />;
};

export default Editor;