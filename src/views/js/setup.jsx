import React from 'react'
import { render } from 'react-dom'

function int(v) {
  return parseInt(v, 10)
}
function bool(v) {
  v = v.toString().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes' || v === 'y'
}

function notEmpty(value) {
  return value && value.toString().trim().length > 0
}
function gtz(value) {
  value = int(value)
  return value > 0
}
function inRange(max, min) {
  return (value) => {
    value = int(value)
    return value >= min && value <= max
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.fields = {
      name: {
        label: 'Connection Name',
        check: [notEmpty]
      },
      server: {
        label: 'Server',
        default: '127.0.0.1',
        check: [notEmpty]
      },
      dialect: {
        label: 'Dialects',
        values: [
          'MySQL', 'MSSQL', 'PostgreSQL'
        ],
        check: [notEmpty]
      },
      port: {
        label: 'Port', type: 'number',
        check: [notEmpty, inRange(1, 65535)],
        parse: int
      },
      database: {
        label: 'Database',
        check: [notEmpty]
      },
      username: {
        label: 'Username',
        check: [notEmpty]
      },
      askForPassword: {
        label: 'Ask password?',
        values: [{ text: 'No', value: 0 }, { text: 'Yes', value: 1 }],
        default: 1,
        parse: bool
      },
      password: {
        label: 'Password'
      },
      connectionTimeout: {
        label: 'Connection Timeout (sec)',
        type: 'number',
        default: 15,
        check: [notEmpty, gtz],
        parse: int
      },
    }
    const data = Object.keys(this.fields).reduce((obj, f) => {
      obj[f] = this.fields[f].default || ''
      return obj
    }, {})
    this.state = {
      data,
      errors: {}
    }
  }

  handleChange(e) {
    const newData = Object.assign({}, this.state.data, {
      [e.target.name]: e.target.value
    });
    this.setState({ data: newData }, );
  }

  handleSubmit(e) {
    e.preventDefault();
    const submitData = Object.keys(this.fields).reduce((data, field) => {
      const parse = this.fields[field].parse || ((v) => (v === '' ? null : v))
      data[field] = parse(this.state.data[field])
      return data
    }, {})
    console.log(submitData)
    return false;
  }
  render() {
    const formFields = Object.keys(this.fields).map((f, i) => {
      const field = this.fields[f]
      if (Array.isArray(field.values)) {
        const options = field.values.map((o, k) => {
          return (<option value={o.value ? o.value : o} key={k}>{o.text ? o.text : o}</option>)
        })
        return (
          <div className='row' key={i}>
            <div className='col-4 capitalize'>{field.label}</div>
            <div className='col-8 capitalize'>
              <select name={f} value={this.state.data[f]} onChange={this.handleChange}>
                {options}
              </select>
            </div>
          </div>
        )
      }
      return (
        <div className='row' key={i}>
          <div className='col-4 capitalize'>{field.label}</div>
          <div className='col-8 capitalize'>
            <input type={field.type || 'text'} name={f} placeholder={field.label} value={this.state.data[f]} onChange={this.handleChange} />
          </div>
        </div>
      )
    })
    return (
      <form onSubmit={this.handleSubmit} className='container'>
        {formFields}
        <div className='row'>
          <div className='col-4 capitalize'>&nbsp;</div>
          <div className='col-8 capitalize'>
            <button className='btn' type="submit">Create</button>
          </div>
        </div>
      </form>
    )
  }
}

render(<App />, document.getElementById('root'))
