var _ = require('lodash')
var React = require('react')
var request = require('superagent')

var RD = React.DOM

var CreatePost = React.createClass({
  getInitialState: function getInitialState () {
    var savedPost
    var state = {
      title: 'new-post-title-here',
      contentMarkdown: 'write some **markdown** here',
      savedPost: null,
      error: false,
      password: null,
      saveButtonLabel: 'Save',
      // usually this is window.localStorage
      storage: this.props.storage || {}
    }
    // Side effect
    try {
      savedPost = JSON.parse(state.storage.postDraft)
    } catch (_error) {
      /* eslint no-empty:0 */
    }
    if (savedPost) {
      state.contentMarkdown = savedPost.content
      state.title = savedPost.title
    }
    return state
  },

  componentDidMount: function componentDidMount () {
    this.preview()
  },

  render: function render () {
    var savedPost = ''
    if (this.state.savedPost) {
      savedPost = RD.div({className: 'saved'},
        'New post saved at ',
        RD.a({href: this.state.savedPost.uri}, this.state.savedPost.title)
      )
    }

    var error = ''
    if (this.state.error) {
      error = RD.div({
        className: 'error'
      },
        RD.strong(null, 'BORKED! ' + this.state.error)
      )
    }
    return RD.div({
      className: 'create-post'
    },
      error,
      savedPost,
      RD.h2(null, this.state.title),
      RD.section({
        className: 'preview',
        dangerouslySetInnerHTML: {__html: this.state.contentHtml}
      }),
      RD.hr(),
      RD.label(
        null,
        'title',
        RD.input({
          name: 'title',
          value: this.state.title,
          onChange: this.setTitle
        })),
      RD.textarea({
        className: 'content',
        ref: 'content',
        value: this.state.contentMarkdown,
        onChange: this.setContent,
        cols: '80',
        rows: '15'
      }),
      RD.label(
        null,
        'github token to save',
        RD.input({
          type: 'password',
          onChange: this.setPassword
        })
      ),
      RD.button({
        onClick: this.save,
        disabled: (this.state.password || '').length < 1
      },
        this.state.saveButtonLabel
      )
    )
  },

  setTitle: function setTitle (event) {
    this.setState({title: event.target.value}, this.saveDraft)
  },

  setContent: function setContent (event) {
    var self = this
    this.setState({contentMarkdown: event.target.value}, function done () {
      self.preview()
      self.saveDraft()
    })
  },

  preview: _.debounce(function preview () {
    var self = this
    request
      // Using relative path here to handle varying blog prefixes
      .post('convert')
      .type('text/x-markdown')
      .send(this.state.contentMarkdown)
      .end(function (error, res) {
        if (error) {
          self.setState({error: res && res.text || error.message})
          return
        }
        self.setState({contentHtml: res.text})
      })
  }, 500),

  saveDraft: function saveDraft () {
    var postDraft = {
      content: this.state.contentMarkdown,
      title: this.state.title
    }
    // Side effect
    this.state.storage.postDraft = JSON.stringify(postDraft)
  },

  setPassword: function setPassword (event) {
    this.setState({password: event.target.value})
  },

  save: function save () {
    var self = this
    this.setState({
      savedPost: null,
      error: null,
      saveButtonLabel: 'Saving…'
    })
    var body = _.pick(this.state, 'title', 'password')
    body.content = this.state.contentMarkdown
    request
      // the POST URI should be the same as the current page
      .post(window.location.pathname)
      .send(body)
      .end(function (error, res) {
        self.setState({saveButtonLabel: 'Save'})
        window.scrollTo(0, 0)
        if (error) {
          self.setState({error: res && res.text || error.message})
          return
        }
        // side effect
        delete self.state.storage.postDraft
        self.setState({savedPost: res.body})
      })
  }
})

module.exports = CreatePost
