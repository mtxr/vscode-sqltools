import styled from 'styled-components';

const Details = styled.details`
  font-size: 1rem;
  margin-bottom: 2em;
  box-shadow: var(--docsearch-modal-shadow);
  width: 100%;
  background: var(--theme-bg-hover);
  position: relative;
  border-radius: 0.25em;
  overflow: hidden;

  .CodeMirror-lines {
    min-height: 5em;
  }
  summary > div,
  > div {
    background: var(--theme-bg-hover);
    flex-basis: 100%;
    padding: 0.25em 2em;
  }
  summary {
    display: inline-block;
    outline: none;
    color: var(--theme-text);
    display: flex;
    padding: 0.25em 1em;
    align-items: center;
    cursor: pointer;
    flex-wrap: wrap;
    span {
      flex: 1;
      text-decoration: none;
      color: inherit;
      font-size: 1.2em;
      margin-bottom: 0.25em;
    }
    div {
      margin: 0 -1em -0.25em;
      p:first-child {
        margin-top: 0
      }
      p:last-child {
        margin-bottom: 0
      }
    }
    svg {
      flex-grow: 0;
      transform: rotate(-90deg);
      margin-left: -0.25em;
      margin-right: 0.25em;
      width: 1em;
      height: 1em;
    }

    small {
      margin-left: 1em;
      opacity: 0.6;
      font-family: monospace;
      font-size: 0.7em
    }
  }
  summary::-webkit-details-marker {
    display: none;
  }

  &[open] {
    svg {
      transform: rotate(0);
    }
  }
  > div {
    padding: 2em;
    padding-top: 0;
  }

  label {
    font-weight: bold;
    &::after {
      content: ': ';
    }
  }
`;

export default Details;