#Practices

##General Orientation


* Pragmatic Craftsmanship (see The Pragmatic Programmer, Code Complete)
* The #1 primary mandate of the software engineer is managing complexity
* Simple, small, consistent tools
    * Small languages that foster consistency such as CoffeeScript or Python
    * One and preferably only one good way to do it
    * Significant white space fosters consistency, so I use it
    * Small core library plus good package management such as node.js with npm
    * Big, complex, heterogeneous languages like Perl and Ruby aren't compatible with my general orientation (but I will code in Ruby when appropriate)
* Correctness and clarity are king
    * readability and maintainability are more important than brevity
* Clever is bad. Period.
    * Remove all magic (see [Django Pony](http://djangopony.com/))
* Libraries over frameworks
    * My code invokes library methods
    * No "your code goes here" boilerplate
* Right tool for the right job
* Slow, calm, and correct
    * I build working software that is well-crafted

See also my [code conventions](/code_conventions)

##Data Modeling

* Integrity-first
    * Default attitude is traditional referential integrity with transactions and strict expectations of data consistency and durability
    * Sacrifice consistency, integrity or durability to get performance or convenience when warranted
    * Properly coding for collections of data where individual records can vary greatly is difficult. Stick with consistent records.
    * Disciplined data migrations should be part of the normal development process
* Minimalism
    * Each field and record has perpetual maintainance cost
    * Only add more data when clearly driven by current features
    * Prune stale data as early as possible
* Conform to common system model in end-user terms
    * Avoid abstractions
    * Keep naming clear and consistent with the system model and user interface
    * Model collections based on semantics as opposed to raw data similarity

##Programming Paradigm

* Multi-paradigm taking the best elements of procedural, functional, object oriented
* Pure functional with no side effects has great testability
* Use built-in data structures (lists, maps) for simple cases, but go to objects as soon as it is non-trivial
* Encapsulation and composition as opposed to complex inheritence hierarchy
* Prefer basic procedural conditions and loops when they are clearer than complex functional or object oriented patterns

##Testing

* Lots of thorough pure unit tests. Fast (no I/O). High code coverage.
* Modular code. Mock objects. Dependency injection.
* Factories as opposed to fixtures
* Test only the first-party code written for this application
* A small handful of end to end system tests
* phantomjs for headless system test automation

##Process

* Scrum/Agile
    * Short iterations of fixed length
    * Working, deployed software is delivered every iteration
    * Single prioritized work queue
* Velocity
    * Establish team velocity
    * Each iteration a team should be able to do only 1 or 2 large items, a handful of medium items, and a dozen or so small items
* Estimates
    * Avoid them as much as possible
    * Build trust based on past performance instead
    * When unavoidable, keep it simple: small, medium, large
    * Work items must be decomposed until they fit in a single sprint (there is no extra large)
* Lean Startup/Minimum Viable Product. Launch and learn. Rinse and repeat.

##Devops

* Clear development, staging, production environments from day one
* Staging means production minus users
* Should be able to rebuild entire app infrastructure with code and docs in the main source code repository
* [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) branch management structure
* [Semantic Versioning](http://semver.org/)
* Modified [12-Factor](http://www.12factor.net/) principles
