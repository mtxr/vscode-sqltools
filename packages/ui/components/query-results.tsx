import React, { ReactNode } from 'react';
import ReactTable from 'react-table';
import { DatabaseInterface } from '@sqltools/core/interface';

interface QueryProps {
  value: string;
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
      <div className={'collapse ' + (this.state.open ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>
          View Query <i className='icon' />
        </div>
        <div className='collapsible'>
          <pre>{this.props.value}</pre>
        </div>
      </div>
    );
  }
}
interface MessagesProps {
  value: any;
  error?: any;
}

type MessagesState = ((prev: any) => { open: boolean }) & { open: boolean };
export class Messages extends React.Component<MessagesProps, MessagesState> {
  private size: number = 0;
  private messages: string[] = [];
  constructor(props) {
    super(props);
    this.state = { open: props.value.length > 0 };
    this.size = props.value.length;
    this.messages = props.value;
    if (this.messages.length === 0) {
      this.messages.push('No messages to show.');
    }
  }
  toggle() {
    this.setState((prev) => ({
      open: !prev.open,
    }));
  }
  render() {
    return (
      <div className={'collapse ' + (this.state.open ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>
          Query Messages <small>({this.size} messages)</small>
          <i className='icon' />
        </div>
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

  private filters = {};
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
      <div className='results-table'>
        <ReactTable
          // tslint:disable-next-line:quotemark
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
          getTdProps={(state, rowInfo, column) => {
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
          style={{
            height: '98%',
          }}
        />
      </div>
    );
  }
}
interface QueryResultProps {
  error: any;
  value: any;
  className?: string;
}
export class QueryResult extends React.Component<QueryResultProps, {}> {
  render() {
    let table: string | ReactNode = 'Query with errors. Please, check the error below.';
    if (this.props.value.error !== true) {
      table = <ResultsTable value={{ cols: this.props.value.cols, data: this.props.value.results }} />;
    }
    return (
      <div className={'result fix-height ' + this.props.className}>
        {table}
        <div className='query-extras'>
          <Query value={this.props.value.query} />
          <Messages value={this.props.value.messages} error={this.props.value.error || false} />
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
}

export default class QueryResults extends React.Component<{}, QueryResultsState> {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false, resultMap: {}, queries: [] };
  }
  toggle(query: QueryResultsState['queries'][number]) {
    this.setState({
      activeTab: query,
    });
  }

  componentDidMount() {
    this.refreshData();
    window.addEventListener('message', (message) => {
      if (!message.data) return;
      switch (message.data.action) {
        case 'refresh':
          this.refreshData();
          break;
      }
    });
  }

  refreshData() {
    let interval = setInterval(() => {
      fetch(`${(window as any).apiUrl}/api/query-results`)
        .then((res) => res.json())
        .then(
          (res) => {
            if (!res.isLoading) {
              clearInterval(interval);
              interval = null;
            }
            this.setState({
              isLoaded: true,
              queries: res.queries,
              resultMap: res.resultMap,
              error: res.error,
              activeTab: res.queries[0],
            });
          },
          (e) => void 0,
        );
    }, 500);
  }
  render() {
    if (!this.state.isLoaded) {
      return <h2>loading...</h2>;
    } else if (this.state.isLoaded && this.state.error) {
      return (
        <div>
          <h2>Query errored. Check the logs.</h2>
          <h4>{this.state.error.toString()}</h4>
        </div>
      );
    }
    const tabs = [];
    const results = this.state.queries.map((query: string) => {
      const res = this.state.resultMap[query];
      tabs.push(
        <li
          title={query}
          key={query}
          onClick={this.toggle.bind(this, query)}
          className={'truncate ' + (this.state.activeTab === query ? 'active' : '')}
        >
          {res.query}
        </li>,
      );
      return (
        <QueryResult
          value={res}
          key={query}
          error={res.error}
          className={this.state.activeTab === query ? 'active' : ''}
        />
      );
    });
    return (
      <div className='fix-height'>
        <ul className='tabs'>{tabs}</ul>
        <div className='results'>{results}</div>
      </div>
    );
  }
}
