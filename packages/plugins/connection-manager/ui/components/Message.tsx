import styled from 'styled-components';

const Message = styled.span<{ fontSize?: string; type?: 'error' | 'success' | 'warning' }>`
  border-radius: 4px;
  padding: 4px;
  display: inline-block;
  background: ${p => p.type === 'error' ? 'rgba(255, 0, 0, 0.4)' : null};
  background: ${p => p.type === 'success' ? 'rgba(0, 255, 0, 0.4)' : null};
  background: ${p => p.type === 'warning' ? 'rgba(255, 255, 0, 0.4)' : null};
  font-size: ${p => p.fontSize};
`;

export default Message;