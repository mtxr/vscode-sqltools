/** @jsx jsx */
import React from 'react';
import { jsx, Styled } from 'theme-ui';

export const Code = ({ className, ...props }) => {
  return <Styled.code {...props} />;
};

Code.InlineCode = props => {
  return <Styled.inlineCode {...props} />;
};
