import styled from 'styled-components';

const common = `
  padding: 4px 8px;
  margin: 0 4px;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
`

const A = styled.a<{ fg?: string; bg?: string; float?: 'right' | 'left' }>`
  ${common}
  float: ${p => p.float};
  color: ${p => p.fg || 'white'};
  background: ${p => p.bg || 'var(--vscode-editorLink-activeForeground)'};
  &:hover {
    color: ${p => p.fg || 'white'};
  }
`;
const Button = styled.button<{ fg?: string; bg?: string; float?: 'right' | 'left' }>`
  ${common}
  float: ${p => p.float};
  color: ${p => p.fg || 'white'};
  background: ${p => p.bg || 'var(--vscode-editorLink-activeForeground)'};
  &:hover {
      color: ${p => p.fg || 'white'};
  }
`;

(Button as any).a = A;

export default Button as (typeof Button) & { a: typeof A };