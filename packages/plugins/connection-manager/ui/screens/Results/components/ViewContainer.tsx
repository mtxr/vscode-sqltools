import React from 'react';

const ViewContainer: React.SFC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({ className, ...props }) => (
  <div className={('query-results-container fullscreen-container ' + (className || '')).trim()} {...props}/>
);

export default ViewContainer;