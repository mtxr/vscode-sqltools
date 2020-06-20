import { Grid } from '@devexpress/dx-react-grid-material-ui';
import styled from 'styled-components';
const GridRoot: typeof Grid.Root = styled(Grid.Root)`
  width: 100vw;
  overflow: auto;
  height: 100%;
  flex: 1;
`;
export default GridRoot;