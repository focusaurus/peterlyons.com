var _ = require('lodash')
var boolean = require('boolean')
var React = require('react')
var request = require('superagent')
var ReactDOM = require('react-dom')

var RD = React.DOM

// .createPost(ng-app="createPostApp", ng-controller="CreatePost", ng-cloak)
//   .error(ng-if="error")
//     strong BORKED! {{error}}
//   .saved(ng-if="savedPost") New post saved at&nbsp
//     a(ng-href="{{savedPost.uri}}") {{savedPost.title}}
//   section.preview(ng-bind-html="contentHtml")
//   hr
//   label
//     | title
//     input(name="title", ng-model="title")
//   textarea.content(cols="80", rows="15", ng-model="contentMarkdown")
//   label
//     | password to save (github token)
//     input(type="password", ng-model="password")
//   button(ng-click="save()", ng-disabled="!password" ng-bind="saveButtonLabel")

var CreatePost = React.createClass({
  getInitialState: function getInitialState () {
    return {
      title: 'new-post-title-here',
      contentMarkdown: 'write some **markdown** here',
      savedPost: null,
      error: false,
      password: null,
      saveButtonLabel: 'Save'
    }
  },

  merge: require('../merge'),

  setTitle: function setTitle (event) {
    this.setState({title: event.target.value})
  },

  setPassword: function setPassword (event) {
    this.setState({password: event.target.value})
  },

  preview: function preview (event) {
    var self = this
    this.setState({
      error: null,
      contentMarkdown: event.target.value
    })
    var postDraft = {
      content: event.target.value,
      title: this.state.title
    }
    // this.localStorage.postDraft = JSON.stringify(postDraft)
    // Using relative path here to handle varying blog prefixes
    request
      .post('convert')
      .type('text/x-markdown')
      .send(postDraft.content)
      .end(function (error, res) {
        if (error) {
          self.setState({error: res && res.text || error.message})
          return
        }
        self.setState({contentHtml: res.text})
      })
  },

  save: function save () {
    var self = this
    this.setState({
      savedPost: null,
      error: null,
      saveButtonLabel: 'Saving…'
    })
    var body = _.pick(this.state, 'title', 'contentMarkdown', 'password')
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
        //   delete self.localStorage.postDraft
        self.setState({savedPost: res.body})
      })
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
        value: this.state.contentMarkdown,
        onChange: _.throttle(this.preview, 2000),
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
        disabled: boolean(this.state.password)
      },
        this.state.saveButtonLabel
      )
    )
  }
})

function init () {
  var element = document.querySelector('.create-post-container')
  ReactDOM.render(exports.CreatePost, element)
}

exports.CreatePost = React.createElement(CreatePost)
exports.init = init
