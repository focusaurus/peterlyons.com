# Nice Pretty Modules

## npm modules I use and recommend

---

## lodash

- Inspired by [underscore.js](http://documentcloud.github.io/underscore), but better
- Core data structure helper functions
- functional programming, inheritence, polyfills
- I use it in nearly every project
- ECMAScript 5 Array prototype has .map, .forEach, .filter, which I use

---
```js
["Monday", "Tuesday", "Wednesday"].forEach(function(day) {
  //Don't need lodash for this. Native is OK.
});

var _ = require("lodash");
var user = {
  name: "Bob",
  email: "bob@example.com",
  shoeSize: 11
};
var variant = _.pick(user, "name", "email");
console.log(variant);
//{ name: 'Bob', email: 'bob@example.com' }
```
---

## lodash functions I use frequently

- _.pick
- _.pluck
- _.last
- _.without
- _.uniq
- _.flatten
- _.debounce, _.throttle
- _.omit

---

## Testing

- _mocha.js_ best testing framework
- _expectacle_ least insane expactation library
- _sinon.js_ spies, mocks, stubs
- _rewire_ dependency injection

---

## Web Apps

- _browserify_ Bundle browser JS without reaching for the FaceAxe
  - _brfs_ for loading static files as strings
  - _browserify-shim_ for third party stuff (angularjs)
- _browserify-middleware_ almost-perfect dev/prod workflow
- _cheerio_ for server-side HTML parsing and manipulation
- _supertest_ for testing express.js apps end to end
- _stylus_ for CSS preprocessing (better than LESS, SASS, SCSS)
- _bunyan_ for logging
- _passport.js_ for authentication with _bcrypt_ for password hashing

---

## async.js

Still my go-to flow control library. There are lots of good choices here, though.

## moment.js

Painfully awesome library for Date parsing and manipulation

```js
moment().add(7, 'days').toDate()
Thu Jul 03 2014 12:27:00 GMT-0600 (MDT)
```

---

## AVOID: Bad (but popular) modules

- should.js
- mongoose.js
- requirejs: browserify FTW (see also webpack)
- anything based on the Ruby on Rails asset pipeline

---

## Quagmires: Still no clear winners

- Database layers ORM/ODM
- SQL dialect managers, query libraries
- expectation libraries (expectacle is closest)
- JSON validation

---

## Misc tips about searching for modules

- alternative/rewrites usually better
  - requirejs -> browserify
  - jasmine -> mocha
  - jsdom -> cheerio
  - q -> bluebird (probably...)
- Get familiar with prolific, high-quality authors
- actively maintained
- sensible documentation

---

## Misc tips continued...

- nothing bizarre
- small, focused
- See also substack's [Finding Modules](http://substack.net/finding_modules) article

---

## Use caution for highly expensive switching costs

Try out in a small side project first

- logging
- assertions/expectations
- control flow
- any framework
- DB access and abstractions

---

## The End

[peterlyons.com](/)
