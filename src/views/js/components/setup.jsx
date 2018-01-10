import React from 'react'
import {
  inRange,
  gtz,
  notEmpty,
  bool,
  int
} from './../lib/utils'
import Loading from './loading.jsx'

export default class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const fields = {
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
        default: 'MySQL',
        check: [notEmpty]
      },
      port: {
        label: 'Port', type: 'number',
        default: 3306,
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
        label: 'Save Password?',
        values: [{ text: 'No', value: 'false' }, { text: 'Yes', value: 'true' }],
        default: 'false',
        parse: bool,
        cb: () => {
          const parse = this.state.fields.askForPassword.parse
          const newState = Object.assign({}, this.state)
          newState.fields.password.show = parse(this.state.data.askForPassword) ? 'hidden' : undefined
          this.setState(newState)
        }
      },
      password: {
        show: undefined,
        label: 'Password',
      },
      connectionTimeout: {
        label: 'Connection Timeout',
        info: 'in seconds',
        type: 'number',
        default: 15,
        check: [notEmpty, gtz],
        parse: int
      },
    }
    const data = Object.keys(fields).reduce((obj, f) => {
      obj[f] = typeof fields[f].default !== 'undefined' ? fields[f].default : ''
      return obj
    }, {})
    this.state = {
      loading: true,
      data: data,
      fields: fields,
      errors: {},
      onSaveError: null,
      saved: null
    }
  }

  handleChange(e) {
    const { name, value } = e.target
    const newData = Object.assign({}, this.state.data, {
      [name]: value
    });
    this.setState({ data: newData }, () => {
      const errors = this.validateField(name)
      this.setState({ errors: errors }, () => {
        if (!this.state.fields[name].cb) return
        this.state.fields[name].cb()
      })
    });
  }

  validateField(field) {
    const checks = this.state.fields[field].check || []
    const errors = Object.assign({}, this.state.errors)
    checks.forEach((c) => {
      if (c(this.state.data[field])) {
        errors[field] = null
      } else {
        errors[field] = c.errorMessage
      }
    })
    return Object.keys(errors).reduce((p, f) => {
      if (!errors[f]) return p
      p[f] = errors[f]
      return p
    }, {})
  }

  handleSubmit(e) {
    this.setState({ loading: true })
    e.preventDefault();
    fetch(`${window.location.origin}/api/create-connection`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ connInfo: this.getParsedFormData() }),
    })
      .then(res => {
        return res.json()
      })
      .then((res) => {
        const newState = { loading: false }
        if (res.success) {
          newState.saved = true
        } else {
          newState.onSaveError = res.error
        }
        this.setState(newState)
      })

    return false;
  }
  componentDidMount() {
    this.setState({loading: false }, () => {
      let errors = {}
      Object.keys(this.state.fields).forEach((f) => {
        errors = Object.assign({}, errors, this.validateField(f))
      })
      this.setState({ errors: Object.keys(errors).reduce((p, f) => {
        if (errors[f] === null || typeof errors[f] === 'undefined') return p
        p[f] = errors[f]
        return p
      }, {}) }, () => {
        document.getElementsByTagName('input')[0].focus();
      })
    })
  }

  getParsedFormData() {
    return Object.keys(this.state.data)
      .reduce((d, k) => {
        if (this.state.fields[k].show === 'hidden') {
          return d
        }
        const parse = this.state.fields[k].parse || ((v) => (v === '' ? null : v))
        d[k] = parse(this.state.data[k])
        return d
      }, {})
  }

  render() {
    const formFields = Object.keys(this.state.fields).map((f, i) => {
      const field = this.state.fields[f]
      if (field.show === 'hidden') return null
      const info = field.info ? <small>({field.info})</small> : null
      if (Array.isArray(field.values)) {
        const options = field.values.map((o, k) => {
          return (<option value={typeof o.value !== 'undefined' ? o.value : o} key={k}>{typeof o.text !== 'undefined' ? o.text : o}</option>)
        })
        return (
          <div className='row' key={i}>
            <div className='col-4 capitalize'>{field.label}</div>
            <div className='col-8 capitalize'>
              <select name={f} value={this.state.data[f]} onChange={this.handleChange} disabled={this.state.loading}>
                {options}
              </select>
              {info}
            </div>
          </div>
        )
      }
      return (
        <div className='row' key={i}>
          <div className='col-4 capitalize'>{field.label}</div>
          <div className='col-8 capitalize'>
            <input type={field.type || 'text'} name={f} placeholder={field.label} value={this.state.data[f]} onChange={this.handleChange} disabled={this.state.loading}/>
            {info}
          </div>
        </div>
      )
    })
    const connInfo = JSON.stringify(this.getParsedFormData(), null, 2 )
      .replace(/( *)(".+") *:/g, '$1<span class="key">$2</span>:')
      .replace(/: *(".+")/g, ': <span class="string">$1</span>')
      .replace(/: *([0-9]+(\.[0-9]+)?)/g, ': <span class="number">$1</span>')
      .replace(/: *(null|true|false)/g, ': <span class="bool">$1</span>')
    return (
      <div className="fix-height">
        <form onSubmit={this.handleSubmit} className='container'>
          <div className="row">
            <div className="col-12">
              <h3>Setup a new connection</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              {formFields}
              <div className="row">
                <div className="col-4">&nbsp;</div>
                <div className="col-8">
                  <button className='btn capitalize' type="submit">Create</button>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div
                className="syntax json"
                dangerouslySetInnerHTML={{ __html: connInfo }}
              >
              </div>
              <div>
                {JSON.stringify(this.state.errors)}
              </div>
            </div>
          </div>
        </form>
        <Loading toggle={this.state.loading} />
      </div>
    )
  }
}
