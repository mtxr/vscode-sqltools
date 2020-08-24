import React from 'react';
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui';
const PagingPanelContainer = (buttons: React.ReactNode, showPagination: boolean) => (
  props: PagingPanel.ContainerProps
) => (
  <div className="resultsPagination">
    {buttons}
    <div className={`paginator ${!showPagination ? 'no-buttons' : ''}`}>
      <PagingPanel.Container {...props} />
    </div>
  </div>
);

export default PagingPanelContainer;
