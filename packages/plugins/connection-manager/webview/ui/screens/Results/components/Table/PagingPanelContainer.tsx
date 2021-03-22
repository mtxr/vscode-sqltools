import React from 'react';
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import FooterActions from '../FooterActions';
const PagingPanelContainer = (showPagination: boolean) => (
  props: PagingPanel.ContainerProps
) => (
  <div className="resultsPagination">
    <FooterActions />
    <div className={`paginator ${!showPagination ? 'no-buttons' : ''}`}>
      <PagingPanel.Container {...props} />
    </div>
  </div>
);

export default PagingPanelContainer;
