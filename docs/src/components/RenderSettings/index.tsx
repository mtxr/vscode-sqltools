import React from 'react';
import get from 'lodash/get';
import pkgJson from '../../../../packages/extension/package.json';
import Setting from './Setting';
import styled from 'styled-components';
import components from '../../components';

function getQueryParams() {
  const queryString = window.location.search;
  var query: any = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const SearchContainer = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  margin-bottom: 2em;
  border-radius: .25em;
  border: 1px solid ${(props: any) => props.theme.docz.colors.grayBg};
  max-width: 100%;
  padding-left: 1em;
  font-size: 1.3em;
  overflow: hidden;
  svg {
    width: 1.3em;
    height: 1.3em;
    stroke: ${(props: any) => props.theme.docz.colors.gray};
  }
`;
const Search = styled.input`
  font-size: inherit;
  padding: .5em 1em;
  border: none;
  outline: none;
  flex-grow: 1;
  color: ${(props: any) => props.theme.docz.colors.gray};

`

interface Props {
  path?: string;
  disableSearch?: boolean;
  title?: string;
  exclude?: string[];
  include?: string[];
}

class RenderSettings extends React.Component<Props> {
  state: { jsonProps: any[], search: string } = {
    jsonProps: [],
    search: '',
  };

  constructor(props: any) {
    super(props);
    const jsonProps = get(pkgJson, `contributes.configuration.properties${props.path || ''}`);
    if (jsonProps) {
      this.state = {
        search: '',
        jsonProps: Object.keys(jsonProps)
          .sort((a, b) => a.localeCompare(b))
          .map(name => ({ ...jsonProps[name], name })),
      };
    }
  }
  inputRef = React.createRef<HTMLInputElement>();

  renderSearchContainer = () => this.props.disableSearch ? null : (
    <SearchContainer onClick={() => this.inputRef && this.inputRef.current && this.inputRef.current.focus()}>
      <SearchIcon />
      <Search placeholder="Type to search..." onChange={e => this.setState({ search: e.target.value || '' })} value={this.state.search} ref={this.inputRef}/>
    </SearchContainer>
  );

  renderTitle = () => this.props.title ? (
    <components.h2 id={this.props.title.toLowerCase().replace(/\s/g, '-')}>{this.props.title}</components.h2>
  ) : null;

  componentDidMount() {
    const { q = '' } = getQueryParams();
    q && this.setState({ search: q });
  }

  render() {
    const search = this.state.search.toLowerCase();
    let propsList = this.state.jsonProps;
    const exclude = this.props.exclude || [];
    const include = this.props.include || [];

    if (exclude.length > 0)
      propsList = propsList.filter(prop => !exclude.includes(prop.name));
    if (include.length > 0)
      propsList = propsList.filter(prop => include.includes(prop.name));

    if (search.trim()) {
      propsList = propsList.filter(prop => prop.name.toLowerCase().includes(search));
    }

    return (
      <>
        {this.renderTitle()}
        {this.renderSearchContainer()}
        {propsList.map(prop => {
          return <Setting {...prop} key={prop.name} />;
        })}
      </>
    );
  }
}

export default RenderSettings;
