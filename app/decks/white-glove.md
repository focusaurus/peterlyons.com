# Finding Inconsistencies in Your MongoDB Data

## Peter Lyons

### Denver MongoDB Meetup Group

#### November 3, 2015

---

## About Me

- Independent Consultant
- Full-stack web applications
- node.js specialist
- Built several production apps on MongoDB
- [http://peterlyons.com](http://peterlyons.com)

---

## Schemaless - Yay?

- Short development time
- Emphasizes coding vs pre-planning schema
- **However**, comes with some risks

- No protection against developer mistakes
- Easy to end up with undocumented schema and tribal knowledge
- Easy to end up with inconsistent data


---

## Problem: Discovery

- First day on unfamiliar codebase
- What does the data look like?
- Caters to my data-driven development approach


---

## Problem: Inconsistent Data

- `User.email` started out as a string
- Requirement came down to support multiple emails
- Code changed to store new users as an array instead
- No support to follow-through with this change across all instances of the database, all areas of the codebase


---

## White Glove

- I started coding a tool to help with these challenges

> Release early. Release often. And listen to your customers. -- Eric Raymond

- Demos


---

## Questions, Comments, Suggestions


---

## References

- [White Glove on github](https://github.com/focusaurus/white-glove)
- [White Glove on npm](https://npmjs.com/package/white-glove)
- [Peter Norvig: How Computers Learn](https://www.youtube.com/watch?v=T1O3ikmTEdA)

---

## The End

[peterlyons.com](/)
