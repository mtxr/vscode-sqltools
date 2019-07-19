import React from 'react';

const Separator = () => (<div className="context-menu-separator"></div>);

const Option = ({ value, label, onSelect, command = undefined }) => command
  ? (<a href={`command:${command}`} onClick={() => onSelect(value)} className="context-menu-option">{label}</a>) // @TODO: test if this is working
  : (<div onClick={() => onSelect(value)} className="context-menu-option">{label}</div>);

export default ({ x, y, open, onSelect, options = [], width = 200 }) => {
  if (!open || options.length === 0)
    return null;
  return (<div className="context-menu" style={{ top: `${y}px`, left: `${Math.max(x - width, 15)}px`, width: `${width}px`, zIndex:9 }}>
    {options.map((opt, index) => {
      if (opt === 'sep' || opt.value === 'sep') {
        return <Separator key={index}/>
      }
      if (typeof opt === 'string') {
        return <Option value={opt} label={opt} onSelect={onSelect} key={index}/>
      }
      return <Option value={opt.value || opt.label} label={opt.label} onSelect={onSelect} command={opt.command} key={index}/>
    })}
    </div>);
};
