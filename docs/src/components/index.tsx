import React from 'react';
import editor from './Editor';
import h3 from './h3';

import { components } from 'docz-theme-default';
import checkLocation from './checkLocation';

components.editor = editor;
(components as any).h3 = h3;
const Page = components.page;
(components as any).page = (props: any) => {
  checkLocation(props);
  return <Page {...props} />;
};
export default components;