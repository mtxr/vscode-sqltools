import React from 'react';
import MDX from '../MDX';
import TypeInfo from './TypeInfo';
import Chevron from './Chevron';
import Type from './Type';
import Details from './Details';

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
  return (<Details open>
    <summary>
      <Chevron />
      <span id={`#${name}`}>{name}<Type tag='small' type={props.type} items={props.items} /></span>
      <div><MDX>{markdownDescription || description}</MDX></div>
    </summary>
    <TypeInfo {...props} />
  </Details>);
};

export default Setting;