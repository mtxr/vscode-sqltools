import React from 'react'
import RenderSettings from './RenderSettings'

const RenderConnectionOptions = ({ exclude = [], include = [] }) => (
  <RenderSettings path="['sqltools.connections'].items.properties" exclude={exclude} include={include} disableSearch title="Connecton Options"/>
)

export default RenderConnectionOptions;