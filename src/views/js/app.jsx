import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import QueryResults from './components/query-results.jsx'
import Setup from './components/setup.jsx'

class App extends React.Component {
  render () {
    return (
      <HashRouter>
        <div className='fix-height'>
          <Route path="/setup" component={Setup} />
          <Route path="/query-results" component={QueryResults} />
        </div>
      </HashRouter>
    )
  }
}

render(<App />, document.getElementById('root'))
