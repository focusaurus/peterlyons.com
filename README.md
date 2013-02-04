# peterlyons.com web site

This repo contains a node.js/express.js web application I use to power my personal/professional web site at [http://peterlyons.com](http://peterlyons.com).

Basically, the site supports content in the following formats:

 * static html pages
 * pages written in [jade](https://github.com/visionmedia/jade)
 * pages written in [markdown](http://daringfireball.net/projects/markdown/)
 * a basic blog engine
   * Includes an ATOM feed
   * Allows posts in HTML or markdown
   * contains some DSL magic HTML-ish tags to reduce boilerplate
   * has a handy output pipeline
 * a simple photo gallery system

Over the years, I've tried out various deployment methodologies and file layouts. I tried a full-on static site generator with all the generated files in the git repo, and have now decided I do not like that approach. Thus this site serves dynamic content primarily with tiny bits of caching at the few spots where we get decent bang for our caching buck.

#Related repositories

The site requires 3 git repositories to fully function

1. The code (this repository)
2. The data (blog posts and photo gallery metadata)
3. Static files (images, fonts, etc)

Since the data and static repos aren't very interesting, I don't publish them on github. All the interesting code is in this repository.
