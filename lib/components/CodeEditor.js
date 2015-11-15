import React from 'react'
import ReactDOM from 'react-dom'
import modes from 'boost/vars/modes'
import _ from 'lodash'
var ace = window.ace

module.exports = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool
  },
  getDefaultProps: function () {
    return {
      readOnly: false
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.readOnly !== this.props.readOnly) {
      this.editor.setReadOnly(!!nextProps.readOnly)
    }
  },
  componentDidMount: function () {
    var el = ReactDOM.findDOMNode(this.refs.target)
    var editor = this.editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.setValue(this.props.code)
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/xcode')
    editor.clearSelection()

    editor.setReadOnly(!!this.props.readOnly)

    var session = editor.getSession()
    let mode = _.findWhere(modes, {name: this.props.mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(true)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)

    session.on('change', function (e) {
      if (this.props.onChange != null) {
        var value = editor.getValue()
        this.props.onChange(e, value)
      }
    }.bind(this))

    this.setState({editor: editor})
  },
  componentDidUpdate: function (prevProps) {
    if (this.state.editor.getValue() !== this.props.code) {
      this.state.editor.setValue(this.props.code)
      this.state.editor.clearSelection()
    }
    if (prevProps.mode !== this.props.mode) {
      var session = this.state.editor.getSession()
      let mode = _.findWhere(modes, {name: this.props.mode})
      let syntaxMode = mode != null
        ? mode.mode
        : 'text'
      session.setMode('ace/mode/' + syntaxMode)
    }
  },
  render: function () {
    return (
      <div ref='target' className={this.props.className == null ? 'CodeEditor' : 'CodeEditor ' + this.props.className}></div>
    )
  }
})