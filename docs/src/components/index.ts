import editor from './Editor'
import h3 from './h3'

import { components } from 'docz-theme-default';

components.editor = editor;
(<any>components).h3 = h3;

export default components;