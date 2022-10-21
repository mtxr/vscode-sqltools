import React from 'react';
import MDX from 'react-markdown';
import TypeInfo from './TypeInfo';
import Chevron from './Chevron';
import Type from './Type';

interface SettingProp {
  prop: any;
  name: string;
  description: string;
  markdownDescription: string;
  type: string | string[];
  items: any;
  default: any;
}

const Setting = ({ description, markdownDescription, name, ...props }: Partial<SettingProp>) => {
  return (<details className="details-info" open>
    <summary>
      <Chevron />
      <span id={`${name}`}>{name}<Type tag='small' wrap='code' type={props.type} items={props.items} /></span>
      <div><MDX>{markdownDescription || description}</MDX></div>
    </summary>
    <TypeInfo {...props} />
  </details>);
};

export default Setting;