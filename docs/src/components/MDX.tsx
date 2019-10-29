import React from 'react';
import { components } from 'docz-theme-default';
import MDXBase  from '@mdx-js/runtime'; //ts-diable-line

const MDX = (props: any) => <MDXBase components={components}>{props.children}</MDXBase>

export default MDX;