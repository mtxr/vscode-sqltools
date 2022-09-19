// @ts-ignore
import pkgJson from '../../../../packages/extension/package.json';
import React from 'react';
import get from 'lodash/get';
import Setting from './Setting';

function getQueryParams() {
  const queryString = window.location.search;
  const query: any = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

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
    <div className="search-container" onClick={() => this.inputRef && this.inputRef.current && this.inputRef.current.focus()}>
      <SearchIcon />
      <input placeholder="Type to search settings..." onChange={e => this.setState({ search: e.target.value || '' })} value={this.state.search} ref={this.inputRef} />
    </div>
  );

  renderTitle = () => this.props.title ? (
    <h2 id={this.props.title.toLowerCase().replace(/\s/g, '-')}>{this.props.title}</h2>
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
