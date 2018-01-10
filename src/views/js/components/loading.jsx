import React from 'react'
import ReactDOM from 'react-dom'

export default class Loading extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this).parentNode.style.position = 'relative'
  }
  render() {
    return (
      <div className={this.props.toggle ? 'loading' : ''}>
        <div className='fix-height backdrop'>
          <div className="spinner"></div>
        </div>
      </div>
    )
  }
}
