import React from 'react';
import { WebviewMessageType } from 'lib/interfaces';
import Loading from '../../components/Loading';
import '../../sass/app.scss';
import QueryResult from './QueryResult';
import getVscode from '@sqltools/ui/lib/vscode';
import QueryResultsState from './State';

export default class ResultsScreen extends React.Component<{}, QueryResultsState> {
  state = { connId: null, isLoaded: false, resultMap: {}, queries: [], error: null, activeTab: null };

  saveState = (data, cb = () => {}) => {
    this.setState(data, () => {
      cb();
      getVscode().setState(this.state);
    });
  }

  componentWillMount() {
    window.addEventListener('message', (ev) => {
      return this.messagesHandler(ev.data as WebviewMessageType);
    });
  }

  toggle(query: QueryResultsState['queries'][number]) {
    this.saveState({
      activeTab: query,
    });
  }

  messagesHandler = ({ action, payload, connId }: WebviewMessageType<any>) => {
    console.log({action, payload, connId});
    switch (action) {
      case 'queryResults':
        const queries = [];
        const resultMap = {};
        (Array.isArray(payload) ? payload : [payload]).forEach((r) => {
          queries.push(r.query);
          resultMap[r.query] = r;
        });
        this.saveState({
          connId,
          isLoaded: true,
          queries,
          resultMap,
          error: null,
          activeTab: queries[0],
        });
        break;
      case 'reset':
        this.saveState({ connId: null, isLoaded: false, resultMap: {}, queries: [] });
        break;

      case 'getState':
        getVscode().postMessage({ action: 'receivedState', payload: this.state });
        break;
      default:
        break;
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loading active />;
    } else if (this.state.isLoaded && this.state.error) {
      return (
        <div>
          <h2>Query errored. Check the logs.</h2>
          <h4>{this.state.error.toString()}</h4>
        </div>
      );
    }
    const tabs = this.state.queries.map((query: string) => (
      <li
        title={query}
        key={query}
        onClick={() => this.toggle(query)}
        className={'truncate ' + (this.state.activeTab === query ? 'active' : '')}
      >
        {query}
      </li>
    ));

    return (
      <div className='query-results-container fullscreen-container'>
        <ul className='tabs'>{tabs}</ul>
        <QueryResult
          {...this.state.resultMap[this.state.activeTab]}
        />
      </div>
    );
  }
}
