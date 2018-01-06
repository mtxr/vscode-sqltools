import React from 'react'
import { render } from 'react-dom'
import ReactTable from './lib/react-table'

class App extends React.Component {
  render () {
    return (
      <div>
        <ReactTable
          data={window.data}
          columns={window.cols}
          defaultPageSize={10}
          className='-striped -highlight'
        />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
