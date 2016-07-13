## The Debugger is a Fantastic Comprehension Aid

For most of my time as a programmer, I've been in the "no fancy tools camp". I spurned IDEs (and still do), complex build tools, any flavor of a "project" file an editor needed to supplement the filesystem layout, code analyzers, coverage tools, and all that ilk. I got things done by printing to stdout, kept it simple, and moved on. Not that I haven't tried all of these things at some point or another, but I found all of them were so awkward and cumbersome that not a single one of them stayed in my tool box beyond that initial experimentation or a single project.

However, things have changed with the current state of the Chrome developer tools debugger. I now use this tool constantly and find it to be an absolutely key piece of my arsenal. It's definitely in my top five most valuable tools list. It's not absolutely necessary, but getting by without it now feels like groping around in the dark when there's a perfectly good light switch available.

I attribute this mostly to the fact that Chrome made this tool built-in to the browser and ready to go with the click of a context menu. No plugin. No extension. No special developer build. No configuration file. It's just there and it works.

However, my main goal with this post is not to convince you to use the debugger because it will allow you to find a fix specific bugs more quickly. I want to convince you that stepping through your program in the debugger is a fundamentally valuable experience that will massively increase your understanding of the JavaScript language, the runtime, your own code, and the libraries you are using. It's exploratory, connected, illuminated, and surprising. The analogy I make is if writing to stdout is shining a flashlight on a particular variable value in your program, running the debugger is a bright lantern lighting up huge areas for you. You will see things without having to be specifically looking for them in a particular place a priori.

# How to Use the Debugger

## Get a Good UI Setup

Invest a little time to get a good window layout and workflow for seeing the web page you are developing and the debugger. The debugger can dock to the bottom of the window, the right hand side, or separate into its own window.

Enable source maps and explore the other advanced settings under the gear icon.

## Learn the Primary Debugger Concepts

These are your bread and butter primary tools.

* basic breakpoints
* step over, step into, step out of
* asynchronous code flow
* watch expressions
* the call stack

## Learn the Secondary Debugger Concepts

You don't need these very often, but under certain circumstances, they are essential to tracking things down effectively.

* conditional breakpoints
* pause on exceptions

## Debugger Quirks

Some lines won't accept breakpoints. I don't exactly understand all of these, so please post a comment if you can explain. Sometimes I think it's just syntax where a single expression spans multiple lines and Chrome elects one of those lines (the last one I guess) as the one where a breakpoint can go. Other times I suspect the optimizing compiler has altered the underlying code such that a breakpoint doesn't make sense there anymore, but that's just a hunch that could be entirely incorrect.

Reloading the page sometimes causes a phantom breakpoint to appear and the code to pause.

If you edit the code in the browser while it's running, breakpoints tied to line numbers can get out of alignment.

Overall the UI is pretty cumbersome and could be made much better with some more usability studies.

# Write Debugger-friendly Code

Stick to one statement per line, and avoid complex nested expressions. Rather, put interesting values into variables where they can easily be inspected. So instead of this:

    findWinningTeam(getTeamScores(teams), getRuleSet(lookupConfig(configName));

Make this more debugger-friendly (and more maintainer-friendly in general).

    var config = lookupConfig(configName);
    var ruleSet = getRuleSet(config);
    var scores = getTeamScores(teams);
    findWinningTeam(scores, ruleSet);

This is much easier to add breakpoints and inspect those intermediate values and step over line by line.

At the moment JavaScript code that heavily uses method chaining is frustrating in the debugger. Something like this is hard to step through and requires a series of step in and step out operations.

    get("/users").header("Accept", "application/json").auth(user, password).end(function (error, users) {});

I'm not a big fan of the chaining style in general, but in particular it's a pain when working in the debugger.

# Debugging Server Side node.js (v8-inspector)

As of node.js v6.3.0 there's (experimental) support for debugging via the chrome developer tools inspector built right into node core. No need for helper modules from npm and no need for a separate node-inspector server.

To debug a server, run it with `node --inspect server.js`. Node will print out a URL that starts `chrome-devtools://devtools/remote/serve_file…`. Open that link in Google Chrome and you're ready to debug.

If you need to debug a crash during the initial program load, you can use `node --inspect --debug-brk server.js` to tell the debugger to immediately pause at the start of the program so you can step through and find any early startup bugs.

Under the hood, here's what's happening.

* Your node server program runs one process, which includes v8
* Running node with the `--inspect` argument tells node/v8 to enable the debugger and have it listen for connections on a port, which is 9229 by default.
* Your node server program listens on some port for its requests. For a typical web application, this might be port 3000, for example.
* So that's 1 node process listening for browsers on port 3000 and a debugger user interface on 9229
* When we browse to the chrome-devtools URL, we will see the devtools web UI, and the query string tells chrome to make a connection to the v8 debugger listening on port 9229 and that's how everything gets wired up together properly and we're off and running

<img src="/problog/images/2014/node-devtools-connections.png" alt="diagram of node devtools connections">

# Debugging Server Side node.js code with node-inspector

This section applies to node version prior to v6.3.0.

So this is pretty much the Holy Grail in my opinion. This is a huge selling point of node for me. There's a module in npm called [node-inspector](https://npmjs.org/package/node-inspector) that allows you to use the Chrome debugger to debug your server side node.js code.

The setup can be confusing because there are a bunch of different processes and ports to keep straight in your head, so let me break it down.

* Your node server program runs one process, which includes v8
* Running node with one of the `--debug` argument variants tells node/v8 to enable the debugger and have it listen for connections on a port, which is 5858 by default.
* Your node server program listens on some port for its requests. For a typical web application, this might be port 3000, for example.
* So that's 1 node process listening for browsers on port 3000 and a debugger user interface on 5858
* Now, to use node-inspector, we run that as a second process via `./node_modules/.bin/node-inspector`
* That starts up another process that runs a web server listening on port 8080 by default.
* When we browse to http://localhost:8080/debug?port=5858 we will see the node-inspector web UI, which is basically just the chrome debugger and the query string tells node-inspector to make a connection to the v8 debugger listening on port 5858 and that's how everything gets wired up together properly and we're off and running

<img src="/problog/images/2014/node-inspector-connections.png" alt="diagram of node-inspector connections">

If you need to fix a bug that is crashing your program before you can even get it started and connect the debugger, use `--debug-brk` which tells v8 to pause the program before the very first line is interpretted so you can get node-inspector connected and step through.

# Debugging Your Mocha Tests

To use node --inspect (v6.3.0 or later), you can run your [mocha](http://visionmedia.github.io/mocha/) tests with `node --inspect --debug-brk $(npm bin)/_mocha --timeout=0`. Similary for a test runner like tape or tape-catch it would be `node --inspect --debug-brk $(npm bin)/tape some.test.js`.

For earlier versions of node using node-inspector, mocha supports the same `--debug` and `--debug-brk` arguments as node, so you can also debug your tests within node-inspector. Double victory!

To avoid port collisions, you can provide an alternate port to the process for your mocha tests. This can be done with `mocha --debug-brk=6666`, for example if you want to leave your application process's debugger listening on 5858 while you run mocha tests at the same time debugging them via port 6666.

# Some Workflow Tips

For projects I'm doing active, heavy work on, I usually run them under `node-dev` for automatic restarting on change and always enable the debugger, so `node-dev --inspect server.js`. If I have several projects or microservices that would otherwise create a TCP port conflict binding port 9229, I will pass a project-specific port like `node-dev --inspect=9230 server.js`.

For older projects with node-inspector, I just leave node-inspector running all the time on the default port of 8080. I also usually leave a chrome browser tab open with node inspector all the time and just reload the page when I need to connect to a process and debug it.

# Recommended Reading

* [Chrome Developer Tools Docs](https://developers.google.com/chrome-developer-tools/?csw=1)
* [HTML5 Rocks Introduction to Chrome Developer Tools](http://www.html5rocks.com/en/tutorials/developertools/part1/)
* [Lesser-Known JavaScript Debugging Techniques](http://amasad.me/2014/03/09/lesser-known-javascript-debugging-techniques/)
* [Debugging Asynchronous JavaScript with Chrome DevTools](http://www.html5rocks.com/en/tutorials/developertools/async-call-stack/)
* [Watch Me Code Debugging Screencasts by Derrick Bailey](http://sub.watchmecode.net/debugging-javascript/)
