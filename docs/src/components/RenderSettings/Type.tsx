import React from 'react';

const Type = ({ tag = 'span', wrap, type = [], items = {}, sep = ' | ', lastSep }: any) => {
  const types: string[] = typeof type === 'string' ? [type] : type;
  return React.createElement(
    tag,
    null,
    <>
      {types
        .reduce((childs, t, index) => {
          let content: any = t === 'array' ? `${items.type || 'any'}[]` : t;
          if (wrap) {
            content = React.createElement(wrap, { key: index }, content);
          }
          childs.push(content);

          if (typeof sep === 'string' && lastSep && index === types.length - 2 && types.length > 1) {
            childs.push(lastSep);
          } else if (index !== types.length - 1 && types.length > 1) {
            childs.push(sep);
          }
          return childs;
        }, [] as any)}
    </>
  );
};

export default Type;
