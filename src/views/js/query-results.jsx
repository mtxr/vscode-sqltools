import React from 'react'
import { render } from 'react-dom'

import ReactTable from './lib/react-table'

class App extends React.Component {
  render () {
    console.log('render')
    return (
      (window.content || []).map((queryResult, i) => {
        queryResult.cols = queryResult.cols.map((col) => {
          col.Cell = (row) => {
            return typeof row.value === 'undefined' ? '' : (
              row.value === null ? <small>(NULL)</small> : row.value
            )
          }
          return col
        })
        return <ReactTable
          data={queryResult.results}
          columns={queryResult.cols}
          className='-striped'
          style={{
            height: '100%' // This will force the table body to overflow and scroll, since there is not enough room
          }}
          key={i}
        />
      })
    )
  }
}

render(<App />, document.getElementById('root'))
