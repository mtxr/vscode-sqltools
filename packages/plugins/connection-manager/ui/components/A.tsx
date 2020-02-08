import styled from 'styled-components';

const A = styled.a<{ fg?: string; bg?: string; float?: 'right' | 'left' }>`
  cursor: pointer;
  text-decoration: underline;
  float: ${p => p.float};
  color: ${p => p.fg || 'inherit'};
  background: ${p => p.bg};
`;
export default A;