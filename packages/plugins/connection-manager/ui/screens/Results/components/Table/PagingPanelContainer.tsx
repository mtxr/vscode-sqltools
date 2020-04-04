import React from 'react';
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui';
const PagingPanelContainer = (buttons: React.ReactNode, showPagination: boolean) => (
  props: PagingPanel.ContainerProps
) => (
  <div className="resultsPagination">
    {buttons}
    {showPagination && (
      <div className="paginator">
        <PagingPanel.Container {...props} />
      </div>
    )}
  </div>
);

export default PagingPanelContainer;
