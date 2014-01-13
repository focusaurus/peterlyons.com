# Code conventions

This page will document conventions I use when writing computer code.
Hopefully folks will find them helpful. I will try to explain the reasoning
behind each convention clearly. I have found the rationale omitted from many
coding convention guidelines and found that to be frustrating.

See also [Google's Python Style Guide][1]. Overall it is spot on and goes into
good detail and examples. There are a few points I disagree with, but they are
not super important. My main gripe is there are some points they assert
without explaining the underlying reasoning.

# Guiding Principles

All these conventions reinforce certain core tenets.

##Readability is King

Most of these conventions are about making the code maintainer's job as fast and easy as possible. The faster and more accurately the code maintainer
(whether it's the same person as the author or not) can change the code, the
better. A program that runs perfectly but is unchangeable because it has low
readability is significantly less valuable than a clean and clear program with
some minor bugs that can easily be found and fixed. The fact is, if your code
is hard enough to read, someone will eventually decide to rewrite it, giving
you negative return on the time invested in the first version of the program.

##Precision

Regardless of whether you like to think of code as more like art or more like science (I prefer the latter), code needs to be accurate and precise. There should not be careless code or comments strewn around the code. Code should look like it was created by an engineer. And not like the engineer who probably wrote it - an overtired kid scarfing junk food over a messy desk late at night; it should look like it was written by an old school 1950s chemist in a pristine lab coat who carefully labels every vial in his lab before his fills it. Even if you fancy yourself a "hacker", I think most of us agree that beautiful code just sparkles with precision and clarity and elegance.

##Make One Choice

Many programming laguages support several different ways or syntaxes for the same thing. This is unfortunate, in my opinion, especially for the silly ones. Avoid these silly syntax variations and favor consistently using the most common format. This is also expressed in [PEP 20][2]'s "There should be one-- and preferably only one --obvious way to do it.".

##When In Doubt, Alphabetize

For a sequence of statements where execution or declaration order doesn't matter, if the list is small and very clearly can be organized logically, do that. But if the list is long or has no very clear inherent organization, alphabetize

##Think In Small Chunks

People have varying mental capacities to keep things in their short term memory. Certain complex or compound statements urge the reader to fill up their short term memory with lots of intermediate products in order to comprehend a single complex statement. I find this difficult and especially frustrating when I'm reading someone else's code. And the code is broken. And I'm tired and up late because that code is broken. And the author decided to write some fancy 200-character lambda expression with seven intermediate variables. Here's a real example I encountered at work (altered to protect the guilty):

    <pre>elif svd['method'] == 'some.literal.string' and filter(lambda x: type(x) == type((0,)) and x[1], svd.results.get('test_totals',{}).items()):</pre>

That's a single expression! Completely unreadable to me. Clever, but worse
than worthless.

##Fewer Expressions Per Line

Error messages often include a line number. However, if you get to that line of source code and it is 200 characters long and contains ten complex sub-expressions, you may need to break it up into ten lines of code and rerun it to understand which expression causes the error. If the error is hard (or impossible) to reproduce, you are in for some guesswork.

# Thoughts on naming

Clear naming is absolutely critical, in my opinion. This applies very broadly:
names of products, projects, directories, files, classes, methods, functions,
variables, modules, packages, etc. Clear names make all the difference. I
often will spend ten minutes thinking about the best name for a key class or
method. The fact is, naming is something you can't avoid. You can get away
without writing comments or documentation, but every file needs a name and so
does every variable. Therefore, the absolute minimum you can do is make the
names clear. And it goes a long, long way. Conversely, naming that is
confusing or unclear from the beginning, or that becomes confusing through a
refactoring without the accompanying renaming, is wasteful. The maintainer is
going to waste time (and therefore money) acting on confused assumptions based
on your bad or broken names. If you have a variable called `serverIP`, which
initially contains just a string IP address in dotted quad notation, and then
later you refactor the code so this variable contains `ip:port`, you need to
rename the variable to `serverIPPort`. It's worth the effort to keep the code
straightforward and not full of nasty surprises and tricks.

_See also_ [Andy Lester's article on the two worst variable names][3].

# General Guidelines

Don't use C-style abbreviations that truncate words or omit certain letters. For example: `message->msg, index->idx, value->val, createDispatcher->crtDisp`. I find these highly problematic and irritating. First, they don't follow a single clear rule about how the abbreviation is achieved (sometimes truncation, sometimes dropping just vowels, sometimes dropping certain consonants). Secondly, they aren't clearly pronouncable. Pronouncability helps when discussing code and thinking about it in an audible voice in one's own mind. Thirdly, the premises that originated this convention (presumably ease of typing or length limits imposed by early languages and tools) are no longer relevant. All decent editors have word completion and/or code completion. Modern languages and tools don't have tiny eight-character length limits anymore. Also, as a native English speaker I find it hard enough to parse these things. I assume this is especially difficult for non-native speakers. Editor's note: Never abbreviate the word "password" in code. Don't use "pass". Don't use "passwd". Don't use "pwd". Don't use "pword". Don't do it. I will hunt you down. You must be stopped. The following exceptions are accomodating because of their extreme popularity: `database->Db (so connectToDatabase->connectToDb), identifier->Id`.

Acronyms should be in all caps, even if this eliminates your `camelCase` boundaries. Examples (how I prefer it): `startHTTPDownload, leaveURLAlone, disconnectTCP`. This is just because acronyms must always be capitalized by their nature. It's part of what makes them an acronym.

In configuration files, interactive prompts, and examples, the most usable terms for end users to enter for boolean options are "yes" and "no". These should be used in documentation and examples. We should be case insensitive and lenient and accept many synonyms such as "enabled", "true", "t", "on", "1".

In log files favor fewer distinct log statements, but pack a lot of data into each log statements (include IDs, full paths, lots of context info)

Don't code statements that are optional or will automatically be handled by the system (examples below)

The official guidelines I link to disallow this already, but just to be clear, don't use ASCII art layout tricks with extra spaces to try to beautify or create vertical alignment in your code.

Don't leave decoys. This applies to files, directories, classes, methods, properties, variables, database tables, database table columns, etc. If something is unused and unneeded because it was coded and never actually tied into the execution path of the program, delete it. If it was previously used and isn't any more, delete it. All this decoy stuff just waste's the reader's time trying to understand it or assuming it does get executed and wasting time (potentially lots of time). If it's perfectly valid code that you might need later, you can pull it from your source control system later. If you really can't part with it, create a clearly labeled "graveyard" file or directory or package where you can stash it where it is clear that it is not executing.

I favor the term "invalid" to "illegal" since it is more accurate and the word "illegal" has a very specific connotation to me

Some folks advocate a length limit on methods or functions. They say that chunks of related code should be refactored out into a separate function and then called from the original function. I usually do not find this helpful. Generally, if code is only executed once, I don't put it into it's own function. I find long methods are perfectly readable top to bottom and actually more readable than jumping all over the place to numerous helper functions that are not referenced elsewhere. So if a function has relatively small chunks of related code one after the other, I'm fine with it being one really long function. After all, this is the essence of computation: a long list of instructions. However, things can become less readable when there is a relatively long stretch of code that goes off on a tangent that is loosely coupled to the rest of the code. In that case, it makes sense to refactor out to a dedicated function. For example: 10 lines of validation, 25 lines of parsing, 12 lines of computing A, 30 lines of computing B, 25 lines of formatting the result - this can all be in one function. However, 6 lines of validation, 4 lines of parsing, 200 lines of computing B, 3 lines of formatting the result - it makes sense to compute B in a separate function. It's long enough that it is hard to maintain context on the surronding code while reading all the code that computes B.

Avoid double negatives with boolean variables. Instead, use a positive verb whose meaning is negative. `skipCache = True` is better than `noCache = True`.

# Python Conventions

For the most part, I follow [PEP 8][4], so review that and follow it for the
basic formatting stuff. See also [PEP 20][2]. Note that python's convention
for module names being all lowercase supercedes my guideline about acronyms
always being capitalized.

One brief aside here regarding the "A Foolish Consistency is the Hobgoblin of
Little Minds" section of [PEP 8][4]. I feel it is worth noting that even
though when it comes to formatting and style I do tend toward the extreme of
consistency, but hopefully not past that into foolishness. However, when it
comes to the actual python standard library itself, there is no such thing as
foolish consistency. Even in [PEP 8][4] they admit "The naming conventions of
Python's library are a bit of a mess". The python standard library is riddled
with blatant inconsistencies that reveal that we are dealing with a product of
dozens of authors and pretty bad consistency (much worse that Java in many
cases). Examples abound, but just look at `os.mkdir()` vs. `os.makedirs`. I
have so many times typed `os.mkdirs()` only later to get a `AttributeError`. I
mean, WTF? It's in the same module for crying out loud. I have my opinion
about how this should be (`os.makeDir()` that behaves like `os.makedirs()`),
but I don't care that much as long as they are consistent. If a library is
consistent, I'm flying. At this point I rarely need to read documentation. I
can use most common libraries for IO, date, filesystem, networking just by
looking at the API and assuming it does what makes sense. If there is no
consistency though, it totally gums up the works and slows me to a frustrating
crawl.

Prefer double quotes for most strings. Python allows either, but we should just pick one that we use primarily. Double quotes makes switching between java/c/python easier and allows embedding apostrophes, which is probably slightly more common than needing to embed double quotes. If your string literal needs to contain double quotes, use single quotes.

Import statements should be one per line (don't use import modone, modtwo, modthree). (Make One Choice principle), (Fewer Statements Per Line)

When order of execution is not important, imports should be sorted asciibetically (When In Doubt, Alphabetize). This is within the import statement groupings described in [PEP 8][4].

import statements should all be done at the beginning of the module unless there is a legitimate reason to do otherwise (Make One Choice)

Most of the time, I avoid the "from" keyword in imports and keep the module/package namespace explicit (i.e. always use os.path). The reason is this keeps it clear exactly where each function is coming from. If you have more than one `from somepkg import *` line in a module, the reader may have to do annoying busywork to track down which module contains a particular function. (Readability Is King).

class member property initializations in constructors should be done asciibetically unless execution order matters (When In Doubt, Alphabetize)

Prefer the string substitution `%` operator over using `+` to build strings. I just find it more elegant and easier to change the string later. I use this exclusively in accordance with the Make One Choice principle.

Don't bother closing file objects in short-lived programs such as command line utilities or scripts. Files will be closed automatically by the interpreter. Explicit closing is often regarded as "good form", but I see no strong justification for this for small programs, or even in larger programs where the open file variable is inside a local method/function scope. It's code that you get essentially for free anyway and typing it just means you could do it wrong or make a typo.

Always have a new line after an `if` statement. (Make One Choice)

When building lengthy inline data structures such as dictionaries or lists,
prefer multiple statements (separate initialization and population code) to
overly long inline data structures. This adheres to the Fewer Statements Per
Line principle. For example,

**original**:

<pre>
_platformCfg = {
                "FedoraLinux" :
                { "releases"     : {"1":0,
                                    "2":0,
                                    "3":0},
                  "longName"     : "Fedora Core Linux",
                  "dfCmd"        : "df -k",
                  "sttyUnset"    : "stty noflsh echo",
                  "netstatCmd"   : "netstat -na | grep \":%s \" | grep LISTEN",
                },
                "RHLinux" :
                { "releases"     : {"6.2":1,
                                    "7.1":1,
                                    "7.2":1,
                                    "7.3":1,
                                    "8.0":1,
                                    "9":0,
                                    "2.1WS":1,
                                    "2.1ES":1,
                                    "2.1AS":1,
                                    "3WS":1,
                                    "3ES":1,
                                    "3AS":1,
                                    "4WS":1,
                                    "4ES":1,
                                    "4AS":1},
                  "longName"     : "Red Hat Linux",
                  "dfCmd"        : "df -k",
                  "sttyUnset"    : "stty noflsh echo",
                  "netstatCmd"   : "netstat -na | grep \":%s \" | grep LISTEN",
                },
                "SuSELinux" :
&lt;REMAINING OMITTED FOR BREVITY&gt;
</pre>

**preferred**:
<pre>
_platformCfg = {}
_fedoraCfg = {}
_fedoraCfg["releases"] = {"1": 0, "2": 0, "3": 0}
_fedoraCfg["longName"] = "Fedora Core Linux"
_fedoraCfg["dfCmd"] = "df -k"
_fedoraCfg["sttyUnset"] = "stty noflsh echo"
_fedoraCfg["netstatCmd"] = "netstat -na | grep \":%s \" | grep LISTEN"
_platformCfg["FedoraLinux"] = _fedoraCfg

_rhCfg = _fedoraCfg.copy()
_rhCfg["releases"] = {"6.2": 1, "7.1": 1, "7.2": 1, "7.3": 1, "8.0": 1,
     "9": 0, "2.1WS": 1, "2.1ES": 1, "2.1AS": 1, "3WS": 1, "3ES": 1,
     "3AS": 1, "4WS": 1, "4ES": 1, "4AS": 1, "5SERVER": 1, "5CLIENT": 1}
_rhCfg["longName"] = "Red Hat Linux"
_rhCfg["netstatRe"] = "tcp.+:%s.+LISTEN"
_platformCfg["RHLinux"] = _rhCfg
</pre>

Why?

1. Second version does not duplicate constant values, making it easier to change them in one place and be done with it. (Don't Repeat Yourself)
1. Second version is more expressive. It clearly indicates that you are copying all the data for one key and then just changing some values. The inline literal version requires you to eyeball all the data to attempt to make that determination.
1. As a general rule, I prefer more simple statements over fewer complex/compound statements since they require less working memory in your brain (Think In Small Chunks)

# Java Conventions

Follow [Oracle's Java Code Conventions][5] for formatting rules, etc.

I prefer `Collection.isEmpty()` over `Collection.size() == 0` because it is more directly expressive of the intent

Prefer java.util.List and the other collection classes to arrays. In general they are easier to work with and convenient. Arrays have a tendency to be annoying in java and require System.arraycopy or java.util.Arrays methods.

Prefer returning an empty collection instead of null. Null requires the caller to explicitly check for it. If you return an empty collection, the calling code that handles non-empty and empty are the same. The caller can always call `isEmpty` and special case that as needed.

When order of execution is not important (as is almost always the case in Java), imports should be sorted asciibetically (When In Doubt, Alphabetize). A blank line separating groups of related imports (standard java, each third party library, internal libraries, etc) are OK but I usually don't use them because the alphabetical sorting makes finding what the reader is looking for pretty easy already.

Never omit the curly braces from an `if` statement or other block beginner. (Make One Choice)

# Bourne Shell Conventions

I have now adopted [Google's Shell Style Guide][7], which I find to be quite excellent. There are a few things that break with tradition, but overall I liked it so much that I decided to go with it, including `lowercase_with_underscores` for variable names.

Many of my existing projects have code written to my own conventions before I found the Google Shell Style Guide, but I'm updating them as opportunity presents itself.

# Ruby Conventions

Prefer double quotes for most strings. Ruby allows either, but we should just pick one that we use primarily. Double quotes makes switching between java/c/python/ruby/coffeescript easier and allows embedding apostrophes, which is probably slightly more common than needing to embed double quotes. Interpolation is also supported. If your string literal needs to contain double quotes, use single quotes.

Prefer string interpolation to building up strings with operators

# JavaScript Conventions

Oh God, it's a mess out there, folks. I haven't had time to write my conventions up yet, and most of the existing ones I either have mixed feelings about or think they are just outright bonkers.

Prefer double quotes for most strings. This is mostly unconventional as I ususally see single quotes preferred, however, my reasoning is as follows.

JSON requires double quotes. This makes for less pain converting between JSON and JavaScript. This is important to me.

This also fosters consistency with java, c, python, ruby, and coffeescript.

Aprostrophes are fairly common to want to put into source code. This makes things like `"%23{name}'s Settings"` easy.

I suspect the 2 biggest reasons a lot of JavaScript developers prefer single quotes are

* no shift key required
  * Valid point, but not enough to convince me. I use sticky keys anyway so no big whoop.
* Easy to embed HTML with double-quoted attributes like `var tag = '<a href="/foo.html">foo</a>`;
  * I think with the rise of templating systems, this type of code has become extinct and justifiably so.

# CoffeeScript Conventions

Prefer double quotes for most strings. CoffeeScript allows either, but we should just pick one that we use primarily. Double quotes makes switching between java/c/python/ruby/coffeescript easier and allows embedding apostrophes, which is probably slightly more common than needing to embed double quotes. If your string literal needs to contain double quotes, use single quotes.  Since CoffeeScript is compiled to javascript, there's no performance implication, but even in Ruby, it doesn't seem to matter.

Prefer string interpolation to building up strings with operators

Make liberal use of array literals with one item per line and no commas

Omit parentheses for function definitions that take no arguments

I personally don't like a space after a function argument list like this: <code>someFunc = (one, two) -&gt;</code>, but Jeremy Ashkenas seems to like it, so go with it.

# Comments

This article pre-dates my blog, but you can post any comments you have on this
article [on the corresponding entry on my technology blog][6].

   [1]: http://google-styleguide.googlecode.com/svn/trunk/pyguide.html
   [2]: http://www.python.org/dev/peps/pep-0020/
   [3]: http://www.oreillynet.com/onlamp/blog/2004/03/the_worlds_two_worst_variable.html
   [4]: http://www.python.org/dev/peps/pep-0008/
   [5]: http://www.oracle.com/technetwork/java/codeconvtoc-136057.html
   [6]: /problog/2009/03/code-conventions
   [7]: https://google-styleguide.googlecode.com/svn/trunk/shell.xml