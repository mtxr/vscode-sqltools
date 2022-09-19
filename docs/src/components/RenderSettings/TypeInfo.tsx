import React from 'react';
import Type from './Type';
import styled from 'styled-components';
import MDX from 'react-markdown';

const Table = styled.table<any>`
  border-collapse: collapse;
  margin-top: 1em;
  width: 100%;
  td, th {
    padding: 2px 4px;
    text-align: left;
    word-break: break-word;
    p:first-child {
      margin-top: 0;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  td:first-child {
    font-weight: ${(props: any) => props.header === false ? 'bold' : 'normal'};
  }
  td:first-child, td:last-child {
    white-space: nowrap;
  }
  tr {
    border-bottom: 1px solid var(--theme-navbar-bg);
  }
`;

const TypeInfo = ({ type, default: defaultValue, ...props }: any) => {
  const types = Array.isArray(type) ? type : [type];
  return (
    <div>
      <Table header={false}>
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
      </Table>
      {types.map(t => {
        switch (t) {
          case 'array':
          case 'object':
            const properties = props.properties || (props.items && props.items.properties);
            if (!properties) return null;
            return (
              <React.Fragment key={t}>
                <header> Object Properties</header>
                <Table>
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
                </Table>
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
