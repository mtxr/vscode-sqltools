import React from 'react'
import { render } from 'react-dom'

import ReactTable from './lib/react-table'

class App extends React.Component {
  render () {
    return (
      <div>
        {(window.content || []).map((queryResult, i) => {
          const size = Math.min(50, queryResult.data.length)
          const showPagination = size > 50
          return <ReactTable
            data={queryResult.data}
            columns={queryResult.cols}
            defaultPageSize={size}
            className='-striped'
            showPageSizeOptions={showPagination}
            showPagination={showPagination}
            key={i}
          />
        })}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
