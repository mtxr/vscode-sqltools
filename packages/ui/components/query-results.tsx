import React, { ReactNode } from 'react';
import ReactTable from 'react-table';
import { DatabaseInterface } from '@sqltools/core/interface';
import { WebviewMessageType } from 'lib/interfaces';
import Loading from './loading';

interface QueryProps {
  value: string;
  expanded: boolean;
  toggle: () => void;
}
type QueryState = ((prev: any) => { open: boolean }) & { open: boolean };
export class Query extends React.Component<QueryProps, QueryState> {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  toggle() {
    this.setState((prev) => ({
      open: !prev.open,
    }));
  }
  render() {
    return (
      <div className={'collapse ' + (this.props.expanded ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.props.toggle}>
          View Query <i className='icon' />
        </div>
        { this.props.expanded && (
        <div className='collapsible'>
          <pre>{this.props.value}</pre>
        </div>
        )}
      </div>
    );
  }
}
interface MessagesProps {
  value: any;
  error?: any;
  expanded: boolean;
  toggle: () => void;
}

export class Messages extends React.Component<MessagesProps> {
  private size: number = 0;
  private messages: string[] = [];
  constructor(props) {
    super(props);
    this.size = props.value.length;
    this.messages = props.value;
    if (this.messages.length === 0) {
      this.messages.push('No messages to show.');
    }
  }

  render() {
    return (
      <div className={'collapse ' + (this.props.expanded ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.props.toggle}>
          Query Messages <small>({this.size} messages)</small>
          <i className='icon' />
        </div>
        {this.props.expanded && (
          <div className='collapsible'>
            <div className='messages'>
              {this.messages.map((m, i) => {
                return (
                  <div key={i} className={'message ' + (this.props.error ? 'error' : '')}>
                    {m}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
interface ResultsTableProps {
  value: any;
}
interface ResultsTableState {
  filtered: any;
}
export class ResultsTable extends React.Component<ResultsTableProps, ResultsTableState> {

  constructor(props) {
    super(props);
    this.state = {
      filtered: {},
    };
  }
  render() {
    const cols = this.props.value.cols.map((c) => {
      return {
        Header: c,
        accessor: c,
        Cell: (r) => {
          let v = r.original[r.column.id];
          if (v === null) return <small>(NULL)</small>;
          if (v === true) return <span>TRUE</span>;
          if (v === false) return <span>FALSE</span>;
          if (typeof v === 'object' || Array.isArray(v)) {
            return (
              <div className='syntax json'>
                <pre>{JSON.stringify(v)}</pre>
              </div>
            );
          }
          v = String(v);
          if (!this.state.filtered[r.column.id]) return v;
          return v
            .replace(this.state.filtered[r.column.id], '<###>$1<###>')
            .split('<###>')
            .map((str, i) => {
              if (i % 2 === 1)
                return (
                  <mark key={i} className='filter-highlight'>
                    {str}
                  </mark>
                );
              if (str.trim().length === 0) return null;
              return <span key={i}>{str}</span>;
            });
        },
      };
    });
    return (
      <ReactTable
        noDataText="Query didn't return any results."
        data={this.props.value.data}
        columns={cols}
        filterable
        FilterComponent={({ filter, column, onChange }) => {
          return (
            <input
              type='text'
              placeholder={`Filter by ${column.id}`}
              style={{ width: '100%' }}
              value={filter ? filter.value : ''}
              onChange={(event) => onChange(event.target.value)}
            />
          );
        }}
        getTdProps={(_, rowInfo, column) => {
          try {
            const v = rowInfo.original[column.id];
            const props = {} as any;
            if (v === true) props.className = 'td-icon green';
            if (v === false) props.className = 'td-icon red';
            return props;
          } catch (e) { /** */}
          return {};
        }}
        onFilteredChange={(filtered) => {
          this.setState({
            filtered: filtered.reduce((p, c) => {
              let exp: string | RegExp = String(c.value);
              try {
                exp = new RegExp(`(${exp})`, 'gi');
              } catch (e) { /** */ }
              p[c.id] = exp;
              return p;
            }, {}),
          });
        }}
        defaultFilterMethod={(filter, row) => {
          let exp: string | RegExp = String(filter.value);
          try {
            exp = new RegExp(`(${exp})`, 'gi');
            return exp.test(String(row[filter.id]));
          } catch (e) {
            return String(row[filter.id]) === exp;
          }
        }}
        className='-striped'
      />
    );
  }
}
interface QueryResultProps {
  value: any;
  className?: string;
  expandViewQuery: boolean;
  expandMessages: boolean;
  toggleQuery: () => void;
  toggleMessages: () => void;
}
export class QueryResult extends React.Component<QueryResultProps> {
  errorIcon = (
    <div style={{ width: '50px', height: '50px', marginBottom: '30px' }} dangerouslySetInnerHTML={{
      __html: `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 426.667 426.667; width: 100%; height: 100%;" xml:space="preserve">
  <path style="fill:#F05228;" d="M213.333,0C95.514,0,0,95.514,0,213.333s95.514,213.333,213.333,213.333
    s213.333-95.514,213.333-213.333S331.153,0,213.333,0z M330.995,276.689l-54.302,54.306l-63.36-63.356l-63.36,63.36l-54.302-54.31
    l63.356-63.356l-63.356-63.36l54.302-54.302l63.36,63.356l63.36-63.356l54.302,54.302l-63.356,63.36L330.995,276.689z"/>
</svg>
` }}></div>
  )
  render() {
    let table: string | ReactNode = (
      <div style={{

        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div>
          {this.errorIcon}
        </div>
        <div>Query with errors. Please, check the error below.</div>
      </div>
    );
    const cols = !this.props.value.cols || this.props.value.cols.length === 0 ? [''] : this.props.value.cols;
    if (this.props.value.error !== true) {
      table = <ResultsTable value={{ cols, data: this.props.value.results || [] }} />;
    }
    return (
      <div className={'result'}>
        <div className='results-table'>
          {table}
        </div>
        <div className='query-extras'>
          <Query value={this.props.value.query} expanded={this.props.expandViewQuery} toggle={this.props.toggleQuery}/>
          <Messages value={this.props.value.messages} error={this.props.value.error || false} expanded={this.props.value.error || this.props.expandMessages} toggle={this.props.toggleMessages}/>
        </div>
      </div>
    );
  }
}
interface QueryResultsState {
  activeTab?: string;
  isLoaded: boolean;
  error?: any;
  queries: string[];
  resultMap: {
    [query: string]: DatabaseInterface.QueryResults;
  };
  expandViewQuery: boolean;
  expandMessages: boolean;
}

export default class QueryResults extends React.Component<{}, QueryResultsState> {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false, resultMap: {}, queries: [], expandViewQuery: false, expandMessages: false };
    window.addEventListener('message', (ev) => {
      return this.messagesHandler(ev.data as WebviewMessageType);
    });
  }
  toggle(query: QueryResultsState['queries'][number]) {
    this.setState({
      activeTab: query,
    });
  }

  messagesHandler = ({ action, payload }: WebviewMessageType<any>) => {
    switch (action) {
      case 'queryResults':
        const queries = [];
        const resultMap = {};
        (Array.isArray(payload) ? payload : [payload]).forEach((r) => {
          queries.push(r.query);
          resultMap[r.query] = r;
        });
        this.setState({
          isLoaded: true,
          queries,
          resultMap,
          error: null,
          activeTab: queries[0],
        });
        break;
      case 'reset':
        this.setState({ isLoaded: false, resultMap: {}, queries: [], expandViewQuery: false, expandMessages: false });
        break;

      default:
        break;
    }
  }

  toggleQuery = () => {
    this.setState({
      expandViewQuery: !this.state.expandViewQuery
    });
  }

  toggleMessages = () => {
    this.setState({
      expandMessages: !this.state.expandMessages
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loading toggle={true}/>;
    } else if (this.state.isLoaded && this.state.error) {
      return (
        <div>
          <h2>Query errored. Check the logs.</h2>
          <h4>{this.state.error.toString()}</h4>
        </div>
      );
    }
    const tabs = this.state.queries.map((query: string) => {
      const res = this.state.resultMap[query];
      return (
        <li
          title={query}
          key={query}
          onClick={this.toggle.bind(this, query)}
          className={'truncate ' + (this.state.activeTab === query ? 'active' : '')}
        >
          {res.query}
        </li>
      );
    });
    return (
      <div className='query-results-container fullscreen-container'>
        <ul className='tabs'>{tabs}</ul>
        <QueryResult
          value={this.state.resultMap[this.state.activeTab]}
          key={this.state.activeTab}
          expandViewQuery={this.state.expandViewQuery}
          toggleQuery={this.toggleQuery}
          expandMessages={this.state.expandMessages}
          toggleMessages={this.toggleMessages}
        />
      </div>
    );
  }
}
