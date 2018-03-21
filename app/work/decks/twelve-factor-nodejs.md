# Twelve-Factor Apps In node.js

## Peter Lyons

### node.js Denver/Boulder/Fort Collins Meetup Group

#### May 19, 2015

---

## About Me

- Independent Consultant
- Full-stack web applications
- node.js specialist
- [https://peterlyons.com](https://peterlyons.com)

---

## What is Twelve-Factor?

<figure>![](https://farm6.staticflickr.com/5613/15358706278_5a28094fdc_z_d.jpg)

<figcaption>Photo by [InvernoDreaming](https://www.flickr.com/photos/invernodreaming/) [(CC BY-ND 2.0)](https://creativecommons.org/licenses/by-nd/2.0/)</figcaption>
</figure>

---

## What is Twelve-Factor?

- [12factor.net](http://12factor.net)
- A methodology for application lifecycle management
- Based on Heroku's experience running 1000s of applications
- Optimized for the cloud era: IaaS, SaaS, PaaS, scale out
- Embodies opinions and best practices
- Addresses "systemic problems"

- not the only valid approach
- not appropriate for all applications or organizations

---

## Pre-PaaS Genisis of Twelve-Factor

<figure>![](https://farm1.staticflickr.com/33/43131875_c0314382a2_z_d.jpg)

<figcaption>Photo by [Phil Hollenback](https://www.flickr.com/photos/phrenologist/) [(CC BY-NC 2.0)](https://creativecommons.org/licenses/by-nc/2.0/)</figcaption>
</figure>

---

### Deployment and Operations Before PaaS

- sysadmins + ssh + bash
- undocumented systems, tribal knowledge
- manual repetition of procedures
- error prone
- easy to get into inconsistent state
- scary reboots and rebuilds
- precious golden servers
- relatively tight coupling between the app and the underlying OS
- high variance between dev/test/prod environments
- high variance across companies/applications

---

## Platform as a Service (PaaS)

<figure>![](https://farm8.staticflickr.com/7474/15447707963_9f80204190_z_d.jpg)

<figcaption>Photo by [Dennis Skley](https://www.flickr.com/photos/dskley/) [(CC BY-ND 2.0)](https://creativecommons.org/licenses/by-nd/2.0/)</figcaption>
</figure>

- takes off around 2008 (Google App Engine)
- How does this effect application lifecycles?

---

- as PaaS product category blooms, industry needs to converge on automatable conventions
- need standard workflow

- get latest source
- create build artifact
- deploy to servers
- restart services

---

## The Twelve Factors

---

## 1. Codebase

<figure>![](https://farm4.staticflickr.com/3050/2960047774_6e39a980dc_z_d.jpg)

<figcaption>Photo by [Nick Quaranto](https://www.flickr.com/photos/qrush/) [(CC BY-SA 2.0)](https://creativecommons.org/licenses/by-sa/2.0/)</figcaption>
</figure>

---

## 1. Codebase

- Use git or $SCM
- 1 to 1 mapping repo to app
- have at least distinct prod and stage deploments

- 1 repo containing multiple apps: nope
- 1 app built from multiple repos: nope

- node.js specifics

- extract shared libraries to separate npm repos
- use private git repo URLs or npm Enterprise

---

## 2. Dependencies

<figure>![](https://pbs.twimg.com/media/B-HNKodCcAATQbS.jpg:large)

<figcaption>Photo by [@funniesJS](https://twitter.com/funniesJS) [(CC BY-SA)](https://creativecommons.org/licenses/by-sa/2.0/)</figcaption>
</figure>

---

## 2. Dependencies

- use npm package.json properly
- Incorrect usage of npm accounts for 25-50% of issues Heroku sees with their node.js users
- `npm config set save-exact=true`
- `npm config set save=true`
- `npm config set save-prefix=`
- specify exact versions

---

## 2. Dependencies…

- use shrinkwrap
- never install with `npm -g` even if README says to
- no system-level subprocesses
  - docker containers can help with this
  - This is highly dubious in the long term and espouses the "Inner Platform Effect" antipattern
  - the HTTP implementation in cURL is almost certainly far superior to the one in $YOUR_RUNTIME

---

## 3. Config

<figure>![](https://farm5.staticflickr.com/4117/4764881882_de0ebb806a_z_d.jpg)

<figcaption>Photo by [Ronan](https://www.flickr.com/photos/ronancantwell/) [(CC BY-NC-ND 2.0)](https://creativecommons.org/licenses/by-nc-nd/2.0/)</figcaption>
</figure>

---

## 3. Config

- app loads from OS environment variables
- In systemd, use `EnvFile=`
- don't group into named "environments"

- production, development, staging, etc
- [node-forman](https://www.npmjs.com/package/foreman)can help transition away from this

- npm module: [config3](https://www.npmjs.com/package/config3)

---

## 4. Backing Services

- treat as loosely coupled
- connect via config params
- switch between local and third-party providers with config changes but no code changes
- sadly, most node db libraries do not make it easy to detect and gracefully handle non-working db connections

---

## 5. Build, Release, Run

- https://github.com/heroku/heroku-buildpack-nodejs
- basically "npm install --production" plus a dash of cacheing
- build -> release could be just injecting a config.local.js file
- a build creates an artifact that you could run later, perhaps years later, regardless of what happens on the Internet/www
- Common antipattern: no build stage. Direct git clones/pulls on servers, builds on servers

___

## 5. Build, Release, Run…

- unnecessarily long downtime
  - "npm install" can take minutes
- low reliability
- if npm is down, your app stays down while it's down
- low consistency
- if new packages are published during a rolling deploy, server3 will end up with different versions than server1
- high risk
  - untested code, failed downloads, failed install scripts, etc
  - espoused by ops-ignorant developers
  - put this practice in the same category as people who advise ssh-ing into prod servers and live-editing PHP files

---

## 6. Processes

<figure>![](https://farm2.staticflickr.com/1096/1237061197_6c7039a681_z_d.jpg)

<figcaption>Photo by [█ Slices of Light █▀ ▀ ▀](https://www.flickr.com/photos/justaslice/) [(CC BY-NC-ND 2.0)](https://creativecommons.org/licenses/by-nc-nd/2.0/)</figcaption>
</figure>

---

## systemd service config file

Install to `/etc/systemd/system/mynodejsapp.service`

```ini
[Unit]
Description=My node.js App

[Service]
User=mynodejsapp
Group=mynodejsapp
WorkingDirectory=/opt/mynodejsapp
EnvironmentFile=/etc/mynodejsapp/config
Environment=NODE_ENV=production
ExecStart=/usr/bin/node cluster.js
Restart=always

[Install]
WantedBy=multi-user.target
```
---

## upstart config file (Debian/Ubuntu before 15.04)

Install to `/etc/init/mynodejsapp.conf`

```txt
description "mynodejsapp"
start on filesystem and started networking
respawn
console log
chdir /opt/mynodejsapp
setuid mynodejsapp
setgid mynodejsapp
env PATH=./node_modules/.bin:./node/bin:/usr/bin
env NODE_ENV=production
exec app/server.js
```

---

## 6. Processes

- Don't run as root
- don't daemonize
- Don't use a node-specific process supervisor
- Use systemd or docker restart policies
- local filesystem only as temporary, atomic operation working space as needed

---

## 7. Port Binding

- straightforward
- for web apps, FQDN can come from config

---

## 8. Concurrency

<figure>![](https://farm1.staticflickr.com/233/447698435_fface3ece8_z_d.jpg?zz=1)

<figcaption>Photo by [Nguyen-Anh Le](https://www.flickr.com/photos/discopalace/) [(CC BY-NC-ND 2.0)](https://creativecommons.org/licenses/by-nc-nd/2.0/)</figcaption>
</figure>

---

## 8. Concurrency

- scale out with the shared-nothing process model
- design app as distinct worker/process types
- local state is an antipattern Heroku commonly sees

---

## 9. Disposability

- robust queues
- crash-only

---

## 10. Dev/prod parity

- Don't use "lightweight" dev variants of backing services (sqlite3 etc)
- It's a Vagrant/Docker party and everyone's invited
- Dev: OSX + node.js + mynodejsapp, Docker + PostgreSQL
- Test/Stage/Prod: Docker + node.js + mynodejsapp, Docker + PostgeSQL

---

## 11. Logs

- bole, bunyan, winston
- newline-delimited JSON to stdout
- let the environment deal with rotation, centralization
- systemd/journald` handle it automatically
- upstart "console log" handles it
- `svlogd` from runit
- `multilog` from daemontools

---

## 12. Admin Processes

- stick them in a bin directory

---

## Other Industry Trends

- Immutable Infrastructure
- pets -> cattle
  - http://www.slideshare.net/randybias/architectures-for-open-and-scalable-clouds
  - https://blog.engineyard.com/2014/pets-vs-cattle

---

## Merits of Commercial Service

- Some are worth their weight in gold
- Some are long-term tax on lack of knowledge/experience
- Commercial offerings are often superior to beginner/intermediate in-house approaches, but inferior to expert in-house systems

---

## Sample App Tour of mjournal

1. Codebase: [code](https://github.com/focusaurus/mjournal)
2. Dependencies: [code](https://github.com/focusaurus/mjournal/blob/master/package.json)
3. Config: [code](https://github.com/focusaurus/mjournal/blob/master/config.default.js)
4. Backing Services: [code](https://github.com/focusaurus/mjournal/blob/master/config.default.js)
5. Build, Release, Run: [code](https://github.com/focusaurus/mjournal/blob/master/bin/go#L168)
6. Processes: [code](https://github.com/focusaurus/mjournal/blob/master/deploy/setup-docker.sh.mustache)

---

7\. Port Binding: [code](https://github.com/focusaurus/mjournal/blob/master/app/server.js#L34)

8\. Concurrency: (Oops!) [code](https://github.com/focusaurus/mjournal/blob/master/app/emails/scheduled.js)

9\. Disposability: [code](https://github.com/focusaurus/mjournal/blob/master/app/server.js#L42)

10\. Dev/prod parity: [code](https://github.com/focusaurus/mjournal/blob/master/deploy/setup-docker.sh.mustache)

11\. Logs: [code](https://github.com/focusaurus/mjournal/blob/master/app/log.js)

12\. Admin Processes: [code](https://github.com/focusaurus/mjournal/blob/master/app/emails/dailySummary.js#L51)

---

## Thank You

[Hunter Loftis](https://github.com/hunterloftis) (heroku node build pack maintainer) for review/feedback

---

## References

---

- [12factor.net](http://12factor.net)
- [docker containerization](https://www.docker.com/)
- [Heroku Docker Plugin](https://github.com/heroku/heroku-docker)
- [throng module for cluster worker management](https://www.npmjs.com/package/throng)
- [config3](https://www.npmjs.com/package/config3)

---

- [StrongLoop node.js Deployment Best Practices](https://strongloop.com/strongblog/node-js-deploy-production-best-practice)
- [Immutable Infrastructure is the Future](http://michaeldehaan.net/post/118717252307/immutable-infrastructure-is-the-future)
- [My Post About Avoiding npm -g](https://peterlyons.com/problog/2012/09/managing-per-project-interpreters-and-the-path)
- [Definition and purpose of a staging environment](/practices)
- [Environment Variables Considered Harmful](/problog/2010/02/environment-variables-considered-harmful)

---

## The End

[peterlyons.com](/)
