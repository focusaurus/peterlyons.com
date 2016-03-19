require('./navigation')

function dispatch (path) {
  path = path || window.location.pathname
  switch (path) {
    case '/app/photos-react':
    case '/photos-react':
      require('../personal/photos-react/browser-main')
      break
    case '/career':
      require('./career')
      break
    case '/persblog/post':
    case '/problog/post':
      require('./create-post')
      break
    case '/plus-party':
      require('./plus-party')
      break
    case '':
      break
    default:
  }
}

dispatch()
