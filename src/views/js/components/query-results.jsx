import React from 'react'
import { render } from 'react-dom'
import ReactTable from './../lib/react-table'

export class Query extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  toggle() {
    this.setState((prev) => ({
      open: !prev.open
    }));
  }

  render () {
    return (
      <div className={'collapse ' + (this.state.open ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>View Query <i className='icon'></i></div>
        <div className='collapsible'>
          <pre>
            {this.props.value}
          </pre>
        </div>
      </div>
    )
  }
}

export class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: props.value.length > 0 }
    this.size = props.value.length
    this.messages = props.value
    if (this.messages.length === 0) {
      this.messages.push('No messages to show.')
    }
  }

  toggle() {
    this.setState((prev) => ({
      open: !prev.open
    }));
  }
  render () {
    return (
      <div className={'collapse ' + (this.state.open ? 'open' : '')}>
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>Query Messages <small>({this.size} messages)</small><i className='icon'></i></div>
        <div className='collapsible'>
          <div className='messages'>
            {this.messages.map((m, i) => {
              return (<div key={i} className={'message ' + (this.props.error ? 'error' : '')}>{m}</div>)
            })}
          </div>
        </div>
      </div>
    )
  }
}

export class ResultsTable extends React.Component {
  render() {
    const cols = this.props.value.cols.map((c) => {
      c.Cell = (r) => (r.value === null ? <small>(NULL)</small> : r.value)
      return c
    })
    return (
      <div className='results-table'>
        <ReactTable
          noDataText="Query didn't return any results."
          data={this.props.value.data}
          columns={cols}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          className='-striped'
          style={{
            height: '98%'
          }}
        />
      </div>
    )
  }
}

export class QueryResult extends React.Component {
  render () {
    let table = 'Query with errors. Please, check the error below.'
    if (this.props.value.error !== true) {
      table = <ResultsTable value={{ cols: this.props.value.cols, data: this.props.value.results}} />
    }
    return (
      <div className={'result fix-height ' + this.props.className}>
        {table}
        <div className='query-extras'>
          <Query value={this.props.value.query} />
          <Messages value={this.props.value.messages} error={this.props.value.error || false} />
        </div>
      </div>
    )
  }
}

export default class QueryResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isLoaded: false, active: 0, data: [] }
  }

  toggle(i) {
    this.setState(() => ({
      active: i
    }));
  }

  componentDidMount() {
    fetch(`${window.origin}/api/query-results`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ isLoaded: true, data: res }, () => console.log('state', this.state))
      }, (e) => console.error(e))
  }

  render () {
    if (!this.state.isLoaded) {
      return (<h2>loading...</h2>)
    }

    const tabs = []
    const results = this.state.data.map((res, i) => {
      tabs.push(
        <li
          title={res.query}
          key={i}
          onClick={this.toggle.bind(this, i)}
          className={'truncate ' + (this.state.active === i ? 'active' : '')}
        >
          {res.query}
        </li>
      )
      return <QueryResult
        value={res}
        key={i}
        error={res.error}
        className={this.state.active === i ? 'active' : ''}
      />
    })

    return (
      <div className='fix-height'>
        <ul className='tabs'>{tabs}</ul>
        <div className='results'>{results}</div>
      </div>
    )
  }
}
