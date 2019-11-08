import styled from 'styled-components';

type StyledProps = { hasError?: boolean; file?: boolean; };

const FieldWrapper = styled.div<StyledProps>`
  margin-top: 12px;
  margin-bottom: 18px;
  max-width: 80%;
  display: flex;
  line-height: 23px;

  > label {
    font-weight: bold;
    display: block;
    flex-grow: 0;
    width: 150px;
  }

  > div {
    max-width: 300px;
    box-sizing: border-box;
    width: 100%;
    display: ${p => (p.file ? 'flex' : null)};
    > button {
      position: ${p => (p.file ? 'relative' : null)};
      input {
        opacity: 0;
        position: absolute;
        flex: 1;
        cursor: pointer;
        width: calc(100% - 16px);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
    input,
    select {
      border: ${props =>
        props.hasError ? `1px solid var(--vscode-inputValidation-errorBorder)` : '1px solid transparent'};
    }
    > input {
      flex: ${p => (p.file ? 1 : null)};
    }
    > small,
    > input:not([type='checkbox']):not([type='number']) {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }
    > input[type='checkbox'] {
      display: inline-block;
    }
  }
`;

export default FieldWrapper;
