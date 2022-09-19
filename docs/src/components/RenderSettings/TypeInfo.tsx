import React from 'react';
import Type from './Type';
import MDX from 'react-markdown';

const TypeInfo = ({ type, default: defaultValue, ...props }: any) => {
  const types = Array.isArray(type) ? type : [type];
  return (
    <div>
      <table className="settings-table">
        <tbody>
          <tr>
            <td {...{ width: 150 }}>Type</td>
            <td>
              <Type type={types} items={props.items} tag='code' sep=', ' lastSep={' or '} />
            </td>
          </tr>
          {typeof defaultValue !== 'undefined' && (
            <tr>
              <td>Default Value</td>
              <td>
                {typeof defaultValue === "undefined" ? null : <code>
                  {['object', 'boolean'].includes(typeof defaultValue) ? JSON.stringify(defaultValue) : defaultValue}
                </code>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {types.map(t => {
        switch (t) {
          case 'array':
          case 'object':
            const properties = props.properties || (props.items && props.items.properties);
            if (!properties) return null;
            return (
              <React.Fragment key={t}>
                <header> Object Properties</header>
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Description</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(properties).map(k => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td><MDX>{properties[k].markdownDescription || properties[k].description}</MDX></td>
                        <td>
                          <Type type={properties[k].type} items={properties[k].items} tag='code' sep=', ' lastSep={' or '} />
                          {properties[k].enum && (
                            <ul>
                              {properties[k].enum.map((v: any, i: number) => (
                                <li>{v}{properties[k].enumDescriptions && properties[k].enumDescriptions[i] ? ': ' + properties[k].enumDescriptions[i] : ''}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
              </React.Fragment>
            );
          case 'string':
          case 'boolean':
          case 'number':
          case 'null':
          default:
            return null;
        }
      })}
    </div>
  );
};

export default TypeInfo;
