import PropTypes from 'prop-types'
import React from 'react'
import {
  inRange,
  gtz,
  notEmpty,
  bool,
  int
} from './../lib/utils'
import Loading from './loading.jsx'

class Syntax extends React.Component {
  constructor(props) {
    super(props)
    this.id = `syntax-${(Math.random() * 1000).toFixed(0)}`
    this.state = {
      copyMsg: 'Copy'
    }
    this.interval = null
  }
  copyCode (e) {
    e.preventDefault()
    e.stopPropagation()
    let msg = 'Copied!'
    const range = document.createRange()
    try {
      range.selectNode(document.getElementById(this.id))
      window.getSelection().addRange(range)
      if(!document.execCommand('copy')) {
        throw 'Failed!'
      }
    } catch (err) {
      msg = 'Failed :('
    }
    window.getSelection().removeRange(range)
    this.setState({ copyMsg: msg }, () => {
      clearTimeout(this.interval)
      this.interval = setTimeout(() => {
        this.setState({ copyMsg: 'Copy' })
      }, 1000);
    })
    return false
  }
  render () {
    return (
      <div className="relative">
        <div
          id={this.id}
          className={`syntax ${this.props.language}`}
          dangerouslySetInnerHTML={{ __html: this.props.code }}
        ></div>
        <button className="btn copy-code" type="button" onClick={this.copyCode.bind(this)}>{this.state.copyMsg}</button>
      </div>
    )
  }
}

Syntax.propTypes = {
  language: PropTypes.string,
  code: PropTypes.string.isRequired
}
class FieldWrapper extends React.Component {
  render () {
    const field = this.props.field
    const info = field.info ? <small>({field.info})</small> : null
    const html = this.props.component
    return (
      <div className={'row ' + (this.props.i === 0 ? 'no-margin-first-top' : '')}>
        <div className='col-4 no-margin-left capitalize'>{field.label}</div>
        <div className='col-8 capitalize no-margin-right'>
          {html}
          {info}
        </div>
      </div>
    )
  }
}
FieldWrapper.propTypes = {
  field: PropTypes.any.isRequired,
  component: PropTypes.element.isRequired,
  i: PropTypes.number.isRequired
};

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
          this.setState(newState, this.validateFields)
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
    const data = Setup.loadLocal() || Setup.generateConnData(fields)
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
      Setup.saveLocal(this.state.data)
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
          localStorage.removeItem(Setup.localStorageKey)
          newState.data = Setup.generateConnData(this.state.fields)
        } else {
          newState.onSaveError = res.error
        }
        this.setState(newState, this.validateFields)
      })

    return false;
  }
  validateFields(cb = (() => { })) {
    let errors = {}
    Object.keys(this.state.fields).forEach((f) => {
      errors = Object.assign({}, errors, this.validateField(f))
    })
    this.setState({
      errors: Object.keys(errors).reduce((p, f) => {
        if (errors[f] === null || typeof errors[f] === 'undefined') return p
        p[f] = errors[f]
        return p
      }, {})
    }, cb)
  }

  componentDidMount() {
    this.setState({loading: false }, () => {
      this.validateFields(() => {
        document.getElementsByTagName('input')[0].focus();
      })
    })
  }

  focusField(field) {
    try {
      document.getElementById(field).focus();
    } catch (e) { /**/ }
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
      let formField;
      if (Array.isArray(field.values)) {
        const options = field.values.map((o, k) => {
          return (<option value={typeof o.value !== 'undefined' ? o.value : o} key={k}>{typeof o.text !== 'undefined' ? o.text : o}</option>)
        })
        formField = (
          <select name={f} value={this.state.data[f]}  id={`input-${f}`} onChange={this.handleChange} disabled={this.state.loading}>
            {options}
          </select>
        )
      } else {
        formField = (
          <input type={field.type || 'text'} id={`input-${f}`} name={f} placeholder={field.label} value={this.state.data[f]} onChange={this.handleChange} disabled={this.state.loading} min="1" max="65535"/>
        )
      }
      return (
        <FieldWrapper field={field} key={i} i={i} component={formField} />
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
              <div className="row">
                <div className="col-12 no-margin">
                  <h5 className="no-margin-top">Connection Information</h5>
                </div>
              </div>
              {formFields}
              <div className="row">
                <div className="col-4 no-margin-left">&nbsp;</div>
                <div className="col-8">
                  <button className='btn capitalize' type="submit" disabled={Object.keys(this.state.errors).length > 0}>Create</button>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div><h5 className="no-margin-top">Preview</h5></div>
              <Syntax code={connInfo} language='json'/>
              <div style={{
                display: Object.keys(this.state.errors).length === 0 ? 'none' : 'initial',
              }}>
                <h5>Validations</h5>
                <div className="messages radius">
                  {(Object.keys(this.state.errors).map((f, k) => {
                    return (<div
                      key={k}
                      onClick={this.focusField.bind(this, `input-${f}`)}
                      className='message error pointer'
                      dangerouslySetInnerHTML={{ __html: this.state.errors[f].replace('{0}', `<strong>${this.state.fields[f].label}</strong>`) }}
                    ></div>)
                  }))}
                </div>
              </div>
            </div>
          </div>
        </form>
        <Loading toggle={this.state.loading} />
      </div>
    )
  }
}

Setup.localStorageKey = 'sqltools.setupConnection'

Setup.saveLocal = (data) => {
  localStorage.setItem(Setup.localStorageKey, JSON.stringify(data))
}

Setup.loadLocal = () => {
  const local = localStorage.getItem(Setup.localStorageKey)
  if (!local) return null
  return JSON.parse(local)
}

Setup.generateConnData = (fields) => {
  return Object.keys(fields).reduce((obj, f) => {
    obj[f] = typeof fields[f].default !== 'undefined' ? fields[f].default : ''
    return obj
  }, {})
}
