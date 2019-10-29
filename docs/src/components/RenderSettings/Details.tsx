import styled from 'styled-components';
const Details = styled.details`
  font-size: 1rem;
  margin-bottom: 2em;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  background: #eaeaea;
  position: relative;
  border-radius: 0.25em;
  overflow: hidden;
  transition: ${props => props.theme.docz.transition};

  .CodeMirror-lines {
    min-height: 5em;
  }
  summary > div,
  > div {
    background: #eaeaea;
    flex-basis: 100%;
    padding: 0.25em 2em;
  }
  summary {
    transition: ${props => props.theme.docz.transition};
    display: inline-block;
    outline: none;
    background: ${(props: any) => props.theme.docz.colors.blue};
    color: white;
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
      color: ${props => props.theme.docz.colors.text};
      margin: 0 -1em -0.25em;
      p:first-child {
        margin-top: 0
      }
      p:last-child {
        margin-bottom: 0
      }
    }
    svg {
      transition: ${props => props.theme.docz.transition};
      flex-grow: 0;
      transform: rotate(-90deg);
      stroke: ${(props: any) => props.theme.docz.colors.yellow};
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