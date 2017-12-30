import React from 'react'
import { render } from 'react-dom'
import ReactTable from './lib/react-table'

class Query extends React.Component {
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
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>View Query</div>
        <div className='collapsible'>
          <pre>
            {this.props.value}
          </pre>
        </div>
      </div>
    )
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }

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
        <div className='collapse-toggle' onClick={this.toggle.bind(this)}>Query Result Messages</div>
        <div className='collapsible'>
          {this.messages.map((m, i) => {
            return (<div key={i}>{m}</div>)
          })}
        </div>
      </div>
    )
  }
}

class ResultsTable extends React.Component {
  render() {
    const cols = this.props.value.cols.map((c) => {
      c.Cell = (r) => (r.value === null ? <small>(NULL)</small> : r.value)
      return c
    })
    return (
      <div className='results-table'>
        <ReactTable
          data={this.props.value.data}
          columns={cols}
          className='-striped'
          style={{
            height: '100%' // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
      </div>
    )
  }
}

class QueryResult extends React.Component {
  render () {
    return (
      <div className={'result fix-height ' + this.props.className}>
        <ResultsTable value={{ cols: this.props.value.cols, data: this.props.value.results}} />
        <div className='query-extras'>
          <Query value={this.props.value.query} />
          <Messages value={this.props.value.messages} />
        </div>
      </div>
    )
  }
}

class QueryResults extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: 0 }
  }

  toggle(i) {
    this.setState(() => ({
      active: i
    }));
  }

  render () {
    const tabs = []
    const results = this.props.value.map((res, i) => {
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

class App extends React.Component {
  render () {
    return (
      <QueryResults value={(window.content || [])} />
    )
  }
}

render(<App />, document.getElementById('root'))
