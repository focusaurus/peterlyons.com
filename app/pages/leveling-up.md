# Leveling Up: Career Advancement for Software Developers

## Table of Contents
* [Pillar 1: Technical Competence](#pillar1)
* [Pillar 2: Professional Communication](#pillar2)
* [Pillar 3: Getting Credit for What You Do](#pillar3)
* [Comments](/problog/2011/05/leveling-up)

## Introduction
TL;DR -> [Click here to jump to the first real point if you hate introductions](#pillar1)

This guide explains in detail the three key pillars to achieving success in a large software company. Success is defined here as a combination of desirable outcomes, including the following:

* increased salary
* increased non-salary financial benefits such as bonuses and stock options
* promotions
* the ability to pick and choose your own projects and teammates
* control over your working arrangements
    * flexible time
    * working from home
* increased desirability in the job market
* the sense of accomplishment and pride that comes from doing good work
* (hopefully) the respect and admiration of your peers

The purpose of the guide is to help developers quickly become highly valuable to their organization, and to therefore get promotions, raises, and quality of work benefits on an accelerated time line.

## Audience

This guide is intended for professional software developers. The optimal target audience is the following group of people:

* Professional software developers
* ...in junior positions
* ...working in large software companies

However, much of the more general information in this guide applies equally well to other IT roles including system administrators, DBAs, and network administrators. A lot of this also applies to smaller software companies, although generally they wouldn't have so many different formal positions and titles available for a promotion track.

## Scope of This Guide

This guide is based on my experiences at medium and large software development groups, including areas such as:

* web development
* enterprise software
* enterprise consulting
* financial services

This guide may not apply as directly to other segments in the software/IT industry. The advice here is still valuable, but I don't have enough direct experience with the following areas to claim first-hand knowledge of how things work:

* scientific computing
* academic research
* gaming and entertainment
* educational software
* non-profit organizations
* government and military projects

## Thoughts on the Job Market

For what It's worth, here are my thoughts on the fluctuations in the job market for software developers. The market is consistently huge and favorable. Boom or bust and anywhere in between; if you behave according to the principles described in this guide, you can be assured that an interesting and rewarding job is always going to be available to you. Job security for competent and effective software developers is always sky-high.

Worried about your job going overseas? Again, make yourself valuable to the business using the advice in this guide and you'll be immune to this. The section on [Pillar #2, Communication](#pillar2), shows how to communicate effectively. Someone twelve hours away may be able to contribute valuable code, but there's a strict limit on how deeply they can engage with the business given the realities of email from many time zones away.

## Thoughts on Salary

Software developers are paid a very wide range of salaries. The high end of base salary is easily five times the entry-level salary. Steve McConnell, author of Code Complete and an advocate of the 10x productivity notion, has [this interesting blog post on compensation](http://web.archive.org/web/20120115174127/http://forums.construx.com/blogs/stevemcc/archive/2011/01/22/10x-productivity-myths-where-s-the-10x-difference-in-compensation.aspx) (Link is to web archive, original URL was http://forums.construx.com/blogs/stevemcc/archive/2011/01/22/10x-productivity-myths-where-s-the-10x-difference-in-compensation.aspx)

<h1 id="pillar1">Pillar #1: Technical Competence</h1>

Surely technical competence and the ability to do your job better than your peers is fundamental to career advancement, right? Well, this may come as a surprise to you, but technical competence is NOT the most important factor. [Pillar #2, Communication](#pillar2), is by far the most important factor in how quickly you can advance your career. I'm discussing technical competence first only out of conceptual simplicity and to get these basic points covered so we can then focus on the second and third pillars, which are where all the magic lies.

So in this section we will review the core technical skills that are most crucial to our goal of rapid career advancement. If you want to advance, you need these technical skills and you need to be legitimately good at your job. This guide is about how to EARN promotions, and not some way to game or fake your way to the top.

## Operating System Basics on Several Platforms

There are hordes of developers out there who know a single OS reasonably well. However, in just about any business, it takes more than a single OS to make things run. Thus when something needs to be done on a different OS, the single-OS developer is useless to the business and unable to help. If a basic problem is encountered on any OS, and you have to shrug and point to a colleague who can look into it, it sends a message to management that you are low-skill, entry-level, and should be compensated according to the technical problems you can solve. However, if you have basic familiarity with the different platform, you can at least do some basic troubleshooting or development work, and management views you as more of an asset to the business.

### Windows Basics

Like it or not, you must learn at least the bare minimum about Windows.

* Basic command prompt (cmd.exe) competence:
    * how to open a command prompt
    * how to navigate around the filesystem, create directories, read files, search files
* Essential Windows command line utilities; these are generally easy enough to learn with a basic web search for "X tutorial" where X is the name of the utility:
    * `ipconfig` for network troubleshooting
    * `net sh` for additional command line network utility
    * `net use` for mounting Windows file shares
    * `nslookup` for DNS troubleshooting
    * `ping` and `telnet` for network troubleshooting
        * `telnet` is being used just to test if a TCP connection can be established to a given target host and port
    * `shutdown` for various flavors of local and remote rebooting
    * `mstsc` for Terminal Services client basics, including mstsc /console
* Windows Security Accounts Manager (SAM) and basic user and group administration
* Windows NTFS Access Control List basics:
    * how to configure and troubleshoot filesystem permissions
* Familiarity with the more commonly used control panels:
    * the network control panel
    * Add/Remove Programs and Features
    * Windows Firewall
* The basics of installing, listing, and removing applications in Windows
* The basics of installing, listing, and removing Windows components
* A general understanding of Windows Management Instrumentation (WMI) and how it can be used; being able to hack together a quick Visual Basic script that performs some simple WMI calls is often all that's needed to work some Windows magic and delight the crowd
* The Windows Registry:
    * how the Windows OS and Windows applications use the registry for configuration
    * the basics of backing up the registry and making changes using regedit32.exe
    * basic familiarity with the interesting paths in the registry and the data types for registry keys

### Unix/Linux Basics

There are almost no scenarios where basic (well, intermediate really) familiarity with a Unix style command shell (Bourne Shell) and essential command line utilities are not critical to doing anything useful. If you have basic capabilities with using a Unix command prompt, spend some time refining them. If you are a pure-Windows coder only comfortable inside your IDE, plan to invest some quality time on a Linux machine and get yourself comfortable with that too.

* Shell variables and environment variables:
    * the difference between the two
    * how environment variables are inherited by child processes
    * the use of the `/usr/bin/env` wrapper
* Basic shell scripting control flow:
    * functions, conditionals, loops
    * the test utility/built-in and its oddities
* Querying the filesystem masterfully with `find`, `xargs`, `grep`
* Basic Unix filesystem permissions: `chmod`, `chown`, `chgrp`
* Basic string manipulation with `sed`, `awk`, `cut`, etc. don't waste time learning all the details here. Just learn the three or four most common and useful constructs.
* Working with tar and zip archives:
    * in particular, [this construct of piping through stdout/stdin to exactly clone a directory tree](http://web.archive.org/web/20091213042731/http://www.sun.com/bigadmin/descAll/recursively_copy_fi.html)
    * this version is also super handy: `tar cf . - | tar xf - -C /target/dir`
* `ssh`, `scp`, and `rsync`
    * ssh keys and password-less ssh
    * [This is a great visual explaination of ssh](http://www.unixwiz.net/techtips/ssh-agent-forwarding.html)
* Network troubleshooting with `telnet`, `dig`, `nslookup`, `netstat`, `ping`, netcat (`nc`), `ifconfig`
* NFS basics
* vi (not vim, not emacs)
    * This is because vi ships as standard on all Unix and Linux operating systems - it is therefore omnipresent and reliable. Emacs and vim are not installed by default on Solaris, AIX, HP-UX, etc, so unless you can perform basic open, edit, and save operations in vi, you are going to be stuck.

### Linux-specific Competencies
* Package management with `rpm`, `rpm --verify`
* Linux-specific network configuration (varies per distribution)

### Solaris-specific Competencies
* Package management with `pkgadd`/`pkgrm`/`pkginfo`
* Patch management with `patchadd`/`patchrm`
* Korn shell scripts

## TCP/IP

Get and read a good book on networking with TCP/IP. The canonical work is [TCP/IP Illustrated](http://www.amazon.com/TCP-Illustrated-Vol-Addison-Wesley-Professional/dp/0201633469). I also found the training material for a Cisco Certified Network Associate (CCNA) to be fantastic. I used Todd Lammle's [CCNA Study Guide](http://www.amazon.com/CCNA-Cisco-Certified-Network-Associate/dp/0782141676), which comes with network simulation software so you can cable up switches and routers, edit their configurations, and see if things work properly.
A solid understanding of TCP/IP information is incredibly important. This is pretty much the only single technical topic where every last bit of knowledge depth I have gained has paid dividends in the real world. It's very easy in technical topics to go overboard with knowledge and skill in most areas: for instance, how useful is my knowledge of the low-level details of how x86 PCs format and address hard drives? For practical applications, this information is essentially useless. However, TCP/IP is different. It's everywhere and you can get real benefits from gaining a deeper than average understanding.

Here are the key points you should understand

* IP addressing, classful address spaces, subnetting
* Basics of IP routing and ICMP
* TCP and UDP
    * in particular, an understanding of what a port is, and the values that will be in the source and destination port fields of TCP and UDP messages, comes in very handy when dealing with firewalls

## Troubleshooting and Problem Analysis in Many Environments

This is a chance to really shine outside of your primary role of writing software. When things break, the management chain starts to hear about it quickly and problems escalate up the chain. Management is going to reach out in desperation to anyone technical who can provide a fix. If you can step up and cleanly troubleshoot and resolve the issue, your name will be heard by at least two levels of bosses, and it only takes one or two of these incidents to get on the fast track for promotion.

## Quickly Learning on the Job

The information you need is out there on the web. However, searching and finding highly specific technical information in a general-purpose web search engine actually requires a particular skill. It's not all that easy to track down obscure error messages from the inner depths of some obscure fiber channel driver, for example. Hone your skills at tracking things down. In particular, there will be lots of useless crud to wade through from bulletin boards of clueless people discussing their cluelessness with each other.

## Becoming the "Go-to Person"

This is an easy way to build a reputation and get an assured spot on the next round of promotions. A "go-to person" is the single individual within an organization who can handle a particular issue or area. When you are the only person who can do something, you are more valuable to your organization. There's a formula you can follow to achieve this. Select an area that is difficult, annoying, or otherwise undesirable to most of your peers. Dig in deeply to this area, and get to where you are an expert. Everyone else will run from those issues and you can step up with confidence. Management will notice this. The comparison between most of the staff who can't handle this area, contrasted with your mastery, reflects really well on you.

Here's how I did this at my first IT job working the help desk at my college. It was the late 1990s and my college had predominantly Apple Macintoshes. It was a small liberal arts college which meant that for the most part each department operated more or less independently and there was no centralized support for many back office functions - including for sending out mass mailings. What this meant is that across campus there were a dozen or so administrators who were trying to take a spreadsheet and merge it into a form letter to print out a customized mass mailing - and here's the kicker - and print the envelopes too. We got a lot of calls about this in the help desk, and you can understand why. Printing a document is something these administrators did every day, so they generally had the hang of it. However, doing a mail merge and printing envelopes only happened a few times a year, and so the person doing it was often trying for the first time. Thus, a lot of help desk calls got generated.
Additionally, just as the administrators didn't do these things every day, your average help desk consultant only got a call about mail merge or envelope printing every so often. At that time, it was pretty tricky and very frustrating to do this with the office software and printing software on Mac OS 8/9. There were three wrong ways to load envelopes into the printer envelope feeder, but only one right way. Getting the printer drivers to actually load the envelopes instead of letter paper was tricky, and varied according to the actual model of the printer. The mail merge only worked when you followed a specific voodoo path of configuration and data formatting.

So after I hacked my way through a few of these, I realized the other help desk support staff feared and hated these calls. Although it was tricky, I thought I could get the issues figured out and mastered. So that's what I did over the next few calls. I experimented and eventually learnt enough that for half a dozen different printer models and combinations of Mac OS versions, I could tell a caller exactly how to load the envelopes correctly and configure everything so they would print out correctly the first time. Within a few weeks of me leaving for a mail merge call and returning successful and unscathed after 30 minutes, word got around that I was the "go-to person" for envelope printing and mail merges. All the tickets for this started to come to me. If a call came in while I wasn't working, it would be queued up and an appointment made for me to go there when my next shift started.

Let's look at this from a management perspective. The managers track the help desk metrics and notice what issues are problematic. Suddenly, what used to be a royal pain resulting in lots of unhappy customers is now a solved problem requiring less time and resulting in customer delight. This is the kind of thing my supervisor would bring up in her weekly status meeting and note to management. This positive visibility to management is key. Managers lean one way or the other very quickly based on small amounts of data. So if you ask them for a raise or promotion a little ahead of the normal schedule, one or two of these incidents might be all that you need to get the nod.

## Crossing the IT Silos

In many large organizations, expert specialists are hired into different groups such as networking, storage, database, operating systems, application servers, security, GUI, and patching. These people develop an expertise in a single area, and spend then all their time focused on that area. This creates an environment in which the situation often occurs where if a problem is fully contained in a particular silo, the experts in that silo are competent to resolve it. However, this also means that there is usually a dearth of systems integration knowledge and end-to-end understanding of how a complex system functions. For several reasons, the problems that cause these systems to fail or misbehave often lie across these silo boundaries. If you develop a small amount of expertise in each area and focus on how they interoperate and integrate, you can resolve these problems. By positioning yourself as a systems integration troubleshooter, you are opening up lots of opportunities to step up and resolve tricky problems and thereby gain a lot of positive management exposure.

## Actively Adding Value and Taking Initiative

Periodically step back and take an analytical look at the state of the company. Are the processes and tools working effectively?  What are the pain points and problems you might be able to improve. Find something that is not working and take on a small side project to get it fixed. When doing this, it is best to follow through on your own initiative as opposed to asking for permission beforehand. For example, in the early days of Opsware we had no good collaboration tool beyond email. Our consultants were discovering complex processes that we needed to share with each other effectively. Email is not a good tool for this. So one of our consultants took it upon himself to install and configure a MoinMoin wiki we could use to collaborate on technical documents and projects. He had it up and running before he even mentioned it to management. The wiki quickly became one of the company's most valuable IT assets and completely mission critical. This is still true seven years later. Many times this type of project  doesn't require that much work. Perhaps a weekend of research and configuration and little or no coding. However, this can have a large long-term positive impact on the business, which will get noticed and appreciated by attentive management.

<h1 id="pillar2">Pillar #2: Professional Communication</h1>

I made communication the second pillar so that we could quickly get the technical stuff out of the way before diving into the heart of the issue. Really, communication is what it is all about. This is what distinguishes the developers that go from entry-level to top-level posts in five years instead of twenty years (or never). So here's the magic of this guide. Communication is the single biggest factor in your success, and it's also the easiest to improve in leaps and bounds. Pay close attention to the information here: it has the potential to gain you tens of thousands of extra dollars in salary and benefits on an accelerated schedule. As we go over the various tactics for improving communication, you will see that they are straightforward and not at all difficult.

## The "Duh" List of Things Not to Do

### Don't annoy management.

If your manager finds your behavior irritating, they are likely to discriminate against you when it comes time for promotions, regardless of your professional output. There are many things software engineers do by nature that can easily clash with and annoy managers. It is straightforward to address these issues, and it can have a big financial payoff. This stuff is so easy and obvious that I slap my palm to my forehead every time I see someone violating these rules. They are in many ways common sense, manners, and courtesy, but even so, the unprofessional elements of hacker culture often reveal themselves inappropriately in a professional setting.

* Be on time.
    * This isn't college. You are part of a business and you are paid a salary. Being late to work or to meetings sends a strong negative signal about your commitment to the work, and it annoys managers. Get your act together and be on time.
* Dress appropriately,
    * In some offices, there's truly no dress code and being full-on casual (barefoot with shorts) is acceptable. If you work at one of those places, good for you. Skip ahead past this point. However, many companies and regions still have a dress code that requires business casual dress.
    * It's just not worth the negative exposure to push the limits of coder hygiene and style at work. Have good showering and personal grooming habits. Men, shave or keep your facial hair neatly trimmed. If you are expected to wear business casual, wear actual business casual. If you are unsure about a specific item of clothing, ask a salesperson or colleague. There's a good chance you aren't wearing real dress slacks (as opposed to khakis). If all the managers are wearing real business casual slacks, you should be, too. You probably need to get help selecting the right shoes as well. Those Doc Martens don't count.
    * Note that I can count at least four people on this [list of famous programmers](https://web.archive.org/web/20150401054033/http://www.sherweb.com/blog/the-men-behind-the-code-creators-of-famous-programming-languages) who are clearly clueless about appearance. Your own mileage will vary, but since you didn't invent Unix or C, don't push your luck.
* Be client-facing.
    * Always act as an ambassador for your company and your products.
    * Know how to talk to non-technical users. If you can't do this, get help and work on it. It's not hard, but it takes practice. You should be able to explain exactly what you do, satisfactorily, to your parents. Practice with friends and relatives.
    * Don't bad-mouth your products or services. Yes, you can be clear and frank about issues and limitations, but you can't make general disparaging remarks about your products.
* Watch your language.
    * Profanity usually doesn't cut it. This is especially true in front of clients. In general, most mature businesses will have a profanity-free culture. You may still hear a lot of profanity in some smaller businesses, but this is problematic because if you are in the habit of swearing all the time, it can be really difficult to constantly censor yourself when you need to. Eventually, companies usually make a trade-off between liability and professionalism, and the profanity goes away.

Again, all of these rules should be "no brainers"; things that you should just do, without needing reminders. They are easy and they maximize your chances of success. If you violate them, you take yourself out of the running for the biggest raises and promotions. You might like saying "douchebag" a lot, but if I said you'd get $10K a year more if you stopped saying it, you'd probably clean up your act. Another way to think of it is, if I charged you $6.40 for every time you swore, you would probably stop swearing so much. That's how the math works out if you swear 6 times a day for 260 work days a year (2011) and it costs you a $10K raise.

### Write good emails when interacting with customers.

Here's an example of my response to an annoyed user at my college. This was from 2001, when downloading multimedia files was all the rage, and our network was unable to keep up with the sudden large increase in bandwidth usage. The user sent the following email to the general help desk address. (The name has been changed)

    Is there a reason why it seems to be impossible to sign on to AOL Instant
    Messenger (AIM) during the day? I was told by one rcc that network usage
    by various applications was ranked, and so those with a low priority almost
    could not be used. This seems unreasonable. IM-ing is to many people as
    vital a component of communication and information as email or the Internet
    is. With all the bandwidth problems that the college seems to be having,
    shouldn't you just buy more lines rather than attempt to dictate the
    importance of one application over another (such as surfing the web over AIM
    or RealPlayer)?

    John Doe

Here is the reply I sent.

    John,

    CIT is aware of the many problems we are having with our network this
    year and we are working hard to keep all network services usable while we
    wait for more bandwidth to be installed. We are in the process of
    acquiring additional bandwidth. Please keeps your eyes on
    http://www.oberlin.edu/cit/ for network related news in the coming weeks.
    Things should improve soon, and the bandwidth shaping policies that we are
    implementing are not meant to claim that one use of the network is more
    valid than another, but merely to make sure that a few users do not
    consume all bandwidth and prevent classes that use the Internet from
    functioning. As you may know, the widespread use of Napster and Gnutella
    software virtually crippled the network in the fall.

    Hang in there,

    Peter Lyons
    Help Desk Consultant

Now, this is a pretty straightforward response. There's no magic here and I didn't actually solve anyone's problem, technical or otherwise. However, this email got my name mentioned at the executive staff meeting because here we have some student (I was 22 years old at the time) who is representing the organization in a positive way in face of an upset user.

Around 2009-2010 it became much more common for companies (especially small companies) to be very honest and straightforward when communicating with customers about outages and other problems. There are now many good blog posts available to serve as examples of communicating clearly and helpfully to customers when problems arise. [Read this example from github for reference](https://github.com/blog/744-today-s-outage).

### Make sure management hears your name in a positive light.

Every time your name gets specifically mentioned amongst management in a positive context, you build your reputation by more than you would think. Managers and executives are decision makers, and in general, they usually only have access to summary-level information (hence the term "executive summary"). They don't always see details. So if a manager two or three levels up your management chain hears your name twice a year, and there are several dozen engineers working at your level, that might be all it takes for you to get the nod when promotion time comes around. So jump on whatever opportunities arise to get recognition and be sure to take credit for the work you do. Even a small amount of effort here can pay dividends.


### Use the two-part summary/details email format.

When you have resolved a high-profile issue, you will want to send out a status email to let the interested parties know that the issue is resolved (and that it was resolved by you). It's very important that you deliver this information in two distinct sections. First, write a very brief non-technical executive summary of what the problem was and how it was solved. Do not use any technical jargon in this section. Next, in a clearly differentiated section, you may offer a further level of technical detail. Here's an example from my career.

    John,

    Last night we discovered an issue preventing transaction processing in the
    Ohio facility. We were able to investigate and resolve the issue within 90
    minutes. The transaction processor was caught up to schedule again by
    4:30am. We have added a monitoring script to provide early warning should
    the situation occur. Technical details are below.

    Pete

    Technical Details:

    The /const file system on tp904.oh.example.com filled up. This caused the
    transaction processor to exit. We freed up space by moving archived log
    files to the SAN storage. We ran an integrity check on the transaction files
    (chkinteg.09), and no problems were detected. We restarted the transaction
    processor and verified that it was able to process all transactions and get
    caught up. We added an OpenView alert script for all transaction hosts to
    warn if /const becomes more than 85% full.

#### Sample #2 of two-part email format

    OK, we have a full understanding of all of the myriad issues ----
    was experiencing around OS Provisioning now. Thanks to ---- for
    their assistance with the extended troubleshooting process and to
    Opsware support and sustaining teams that spent lots of time and
    energy pouring through logs and digging deep into the problem to
    find and solve the issues.

    Customer: ----

    Problem: OS Provisioning fails inconsistently

    **Executive Summary**

    ---- was experiencing failed OS Provision attempts nearly every
    time, with builds getting to various stages before failing.
    We have identified multiple underlying problems causing
    failures at different points. These include environmental
    problems, a set of circumstances than can cause the Opsware
    build manager to get into a bad state, and recently-updated
    HP NIC drivers causing the server to change IP addresses at a
    critical point during the OS Provisioning process.

    The environmental factors hae been addressed. The short term
    workaround for the build manager is to 1) only redo the RAID
    config when really necessary and 2) restart the build manager
    nightly or as needed. The medium term fix is to fix a bug in the
    buildscripts. Long term, the build manager should be made to
    survive even when the buildscripts contains this type of problem.
    The temporary workaround for the HP NIC drivers is to skip them
    during OS Provisioning and install them later and trigger a
    hardware registration.

    **Environmental Fixes**

    During troubleshooting and environment verification, several other problems
    in the environment were identified, although there is no evidence that any
    of these contributed directly to the provisioning problems.

    * Servers get the incorrect IP address during network boot.
      * Troubleshooting efforts identified the root cause of this problem to be a
        misconfigured managed server running VMWare serving DHCP on the provisioning
        VLAN. Only 1 device can serve DHCP on a given VLAN since it is based on
        broadcasts, and thus the managed servers being built would be assigned an IP in
        the 192.168.160.x range, which is not reachable from the Opsware core. The rogue
        DHCP server was tracked down with the support of ---- networking group and
        disabled. The problem was then resolved and servers could successfully enter the
        Opsware Server Pool.
    * Build Scripts not the same
      * The OS Provisioning build scripts were not identical between --- and ---- data centers.
        The differesces appear to be insignificant. However, the files were brought into
        sync. The DOS boot images were also checksummed and confirmed to be identical
        between data centers.
     * Database inconsistency
       * There were some remaining differences between the databases in the two data centers after the
        automated resolution tools used by Opsware support had finished. These required
        manual intervention and were brought into sync manually. The multimaster mesh is
        now clean with no conflicts.
     * Incorrect time zone on ----
       * This server was configured for EDT while Opsware requires UTC on all core servers.
        The other 5 servers in the mesh are correctly configured for UTC. This was fixed
        Thursday morning by editing /etc/TIMEZONE and rebooting.
    ...

## Note these key points for communication.

### Use corporate speak.

Listen to how managers and directors talk and use the same terminology as they do.

### Use the right level of technical detail and jargon for your audience.

There is some art to getting this right. If you are communicating in detail about a bug to a fellow developer, feel free to be fully technical. Communicating to tech support, you can be technical about sysadmin stuff, but not include programmer-specific details. Customer emails should be in purely functional terms using the user-facing names for the model elements in your application.

For example, when writing instructions for a technical support engineer, you might be able to provide high level instructions like "restart the frobnicator" and assume the engineer knows the specific commands necessary to do that. If you had to give those same instructions to an end user, you would need to provide clearly explained step-by-step instructions including the exact commands or operations to be performed. If you are in the habit of restarting the frobnicator a dozen times a day, it might seem tedious to you to write out in gory detail how to do it, but keep in mind it is very likely the customer has never heard of the frobnicator and has never had to restart it.

### Be relentlessly professional.

It takes determination to remain professional in times of stress. This is a skill that your management chain has most likely already mastered through experience. You will want to master this behavior through focused practice. What I mean by unprofessional behavior encompasses such things as shouting or becoming audibly agitated, using profanity, personal attacks or insults, blame shifting, or anything else that can be perceived as immature or inappropriate. I can attest from experience that there often times when there is a strong internal urge to blow off steam or "let them have it" when faced with the various annoying realities of big companies (bureaucracy, incompetence, cluelessness, etc). However, any incidence of this sends a message of immaturity and unprofessionalism to management. It also indicates that allowing you to work directly with customers is a risk. Stick to your guns and say what needs to be said, but always use strictly professional manner and demeanor.

### Be a straight shooter.

You might think the previous points about using corporate speak and being professional may be contradictory to being a straight shooter, but that's not the case. By "straight shooter", I mean that you can speak the truth and tell it like it is. You don't need to sugar-coat any technical realities or weasel your way around the current situation. Managers appreciate clarity and directness when it arrives in an acceptable fashion. So if you have bad news or concerns, feel free to voice them accurately and completely. The distinction here is that the language used to communicate has to be professional but the actual content of the message doesn't have to be softened in any way.

### Be a corporate ambassador.

When a company is paying you a salary, you need to be aware that you always represent that company even in your after-work private life. It isn't OK to hit the bar with your buddies and loudly badmouth your employer. These things get overheard and repeated, especially given the omnipresence of numerous communication devices. Before you've finished your rant about how your employer's expense policies are ridiculous, it could have been tweeted by someone who has overheard you. If you really must vent to someone, do it privately in your own home to your spouse or significant other, and limit it to that. Ignoring this advice is an easy (and stupid) way to get immediately put at the bottom of the list for a promotion. Also, never assume that because someone is a stranger or works in an entirely different industry that you can badmouth your employer to them and no harm will come of it. It's a small world and now everyone is highly connected via Facebook and LinkedIn. Word travels fast.

<h1 id="pillar3">Pillar #3: Getting Credit for What You Do</h1>

This is another piece of advice that is so easy to implement that you wouldn't think that it can make you tens of thousands of extra dollars, but it can and it has. So listen up: it's a sad state of affairs but the truth is you can appear as significantly more productive (and therefore more valuable) than your peers even if you are doing equivalent or even inferior work. How can that be? It's easy. No one except you is properly motivated to track your own work and productivity, and most people by default do a lousy job of it if they even make an attempt.
It's a trivial job to keep track of what you do, get credit for it, and look like an absolute rock star. There are plenty of bright and productive developers out there who operate in a state of perpetual deadline panic and never keep track of what they are doing. Thus when performance reviews roll around, they struggle to put together three or four bullet points to describe the major deliverables they worked on over the past year. In addition, while many people do work that is not strictly part of their job description such as helping train new employees, they write it off as "one-off" work because it is not properly tracked; however, over time it tends to actually add up to a significant amount of time and effort.

Here's a simple technique to ensure everything you do for your company is tracked, which allows you to get credit for it and be properly rewarded. The basic points are:

1. Take detailed notes constantly.
1. Summarize your weekly activities in a weekly status report email to your manager.
1. Generate a six-month summary of accomplishments based on the weekly status emails.

Let's look at each of these items in more detail.

### Your Work Journal

Don't skip this one. This is a simple technique that can make a huge difference. Start a work journal - it can be nothing more than a simple text file. You should have one single journal for everything you do for your job. Organize it chronologically: do NOT try to make separate journal files for different roles or clients or projects. Put EVERYTHING in ONE BIG FILE. Don't try to organize it by category or client or anything like that. It is just a chronological journal with the first entry at the top of the file and the last entry at the end of the file. Make sure your text editor can be configured to instantly insert a timestamp, since you can use this to organize your journal. This is straightforward in most good editors, and there are even some OS-level utilities that can do this. Here's a sample from my journal to give you the flavor.

    Tue Nov 08 14:20:00 EST 2005
    -curriour IMAP has a short shell script that goes with it

    Tue Nov 08 14:23:06 EST 2005
    -when a shadowbot starts, it looks in /var/lc/crypto/shadowbotname/onefile.srv (public/private key pair for that comp
    onent)
    -it needs to find one and only one of these srv files
    -it will also load one or more .crt files
    -shadowbot also has client side validation
    -the client's certificate must have been signed by one of the .crt file's CA

    Tue Nov 08 14:30:01 EST 2005
    -certmaster code that the client should be validating the server it is commented out
    -look up the bug on this SAMPL00016632

    Tue Nov 08 14:52:22 EST 2005
    -jay thinks spin.cogbot.crypto.validity.period can be customized in the spin.args
    (14:54:16) jay: spin.cogbot.crypto_validity_period

    Tue Nov 08 14:55:17 EST 2005
    -wow, this is settable in the OCC

    Tue Nov 08 17:14:09 EST 2005
    -great email from Jay
    First of all, try looking on your system (in the openssl dirs) for  CA.pl. That's where I ripped most of this from:

    You can make the root CA like this:

    mkdir rootCA
    cd root CA
    mkdir demoCA
    mkdir demoCA/certs
    mkdir demoCA/crl
    mkdir demoCA/newcerts
    mkdir demoCA/private
    touch demoCA/index.txt

    You make a CSR for your agent CA like this:

    ...<SNIP>....
    Tue Jan 03 13:51:45 EST 2006
    -TASK: XXXX Delegated Administration
    -WIKI SUMMARY: Call with John Doe on twist calls for Delegated Admin

    Tue Jan 03 14:35:56 EST 2006
    -converted the LDAP SSL certificate to pem format thusly:
    openssl x509 -inform DER -outform PEM -in /cust/proserve/B1LDAP-DEV.DER.cer -out /cust/proserve/B1LDAP-DEV.pem

    Tue Jan 03 14:38:27 EST 2006
    -OK, great. Got UserFacade.createExternalUser() working.

    Tue Jan 03 16:05:55 EST 2006
    -WIKI SUMMARY: XXXX ISMTool call with Product Management
    -TASK: XXXX CE
    -WIKI SUMMARY: XXXX Date Status call

    Tue Jan 03 17:27:39 EST 2006
    U035792 is bala's EID

    Tue Jan 03 17:49:09 EST 2006
    -admin role in aaa is ID 1710777

    SQL> select user_id, username from aaa.aaa_user where username='admin';

       USER_ID
    ----------
    USERNAME
    --------------------------------------------------------------------------------
         10777
    admin

Things to note:

* I make notes frequently. Every few minutes is not uncommon.
* I gather anything useful that I might want to search through later, including notes I actively type, copy/paste snippets from my shell, key comments from IRC chat, bits of a helpful email, code fragments, and SQL output.
* In addition to technical notes to which I can later refer, I track my time here as well as putting in summary notes that will go to my manager at the beginning of the next week.
    * These are prefixed with `WIKI SUMMARY:` because I also had a script to automatically post them to our internal wiki.
* I also use this for time tracking, but you shouldn't do that.
    * The lines which start `-TASK:` are for time tracking. I was using a home-grown Python script to parse all the time stamps and compute my hours, especially when I was consulting, and therefore billable to multiple different projects. I also had some colleagues using vim macros for this purpose.
    * There is no need to do this though. Use a third party application such as [SlimTimer](http://slimtimer.com).
* However, whether using a third party tool or your journal, I recommend publishing a summarized daily activity log. Below is an example of mine, which I created by using a Python script to parse the time stamps and `WIKI SUMMARY:` lines from my journal and then post them to our internal MoinMoin wiki. This is a handy reference for me and makes it easy for my managers to see the key tasks I have accomplished. The log should just be a handful of bullet points, probably never more than eight even on a crazy day; often just one bullet point is all you need.

<img src="/images/2011/daily_activity_log_redacted_cropped.png" alt="Daily Activity Log">

Over time, your journal becomes an awesome treasure trove of knowledge. Do NOT worry about managing it. I kept a journal steadily for 6.5 years and my final text file was 207,470 lines long and 5 MB uncompressed. It compresses with bzip2 down to 1.2 MB. Just keep the journal going essentially for ever. Be sure to back it up by including it in a source code management system that has remote backups (git) and/or email a copy of it to yourself periodically.

Now, the key to getting great value out of the journal is to use a text editor with great search capabilities. I have never seen one as good as the "hypersearch" feature in jEdit, but I'm told TextMate has something similar. This becomes very important as the file starts to get very long.

Another key is make sure you can quickly and seamlessly open your journal. I had my F5 key mapped to bring up a virtual desktop that had nothing but my journal file in a maximized window so at any point if I wanted to take a note I could just hit F5 and then start typing. I used F11 to insert the timestamps. You must also have a hot key to instantly put your cursor at the end of the document (I used to use CTRL-END, now it's CMD-DOWN).

#### Helpful Tools for Journaling

* [Keyboard Maestro](http://www.keyboardmaestro.com/) for Mac OS X is a very handy utility in general. For journaling, it can help insert the timestamps if your text editor can't easily insert them.
* [jEdit](http://jedit.org/) was my primary text editor for years, and it has some great features as well as being open source and cross platform. The primary author has moved on though and it is not as actively maintained as I would like. Still, there are some great power features here that I have never seen in any of the alternatives. There is a built-in "Insert Date" macro I use in my journal, and jEdit is great about assigning keyboard shortcuts to any operation.
* Of course, vim and emacs can do all of these things quite handily as well.

#### Keeping a Solid To-Do List

For years I used a simple section at the top of my journal file to manage my short and medium term to-dos, and a wiki page for long-term projects. It was a simple but effective system that grouped tasks into three lists as follows:

    ---------------------------------
    |TODO TODAY|
    ---------------------------------
    [+]This is a task I have already completed
    [.]This is a task I have started but not completed
    []This is a task I intend to complete today

    ---------------------------------
    |TODO SOON|
    ---------------------------------
    []These tasks should be done in the next few days

    ---------------------------------
    |TODO LATER|
    ---------------------------------
    []If I probably won't get to it this week, it goes here

I had macros to mark an item as complete and then move it to another section of the file with a timestamp of when it was completed. Feel free to use a simple system like this. Of course, there are also lots of task management applications out there including [TaDa List](http://tadalist.com/), [Taskforce](http://www.taskforceapp.com/), and many others. The point is use SOME SYSTEM CONSISTENTLY. Don't just rely on memory, or spread projects across different tools. Consider reading one of the classic personal productivity books such as David Allen's extremely popular [Getting Things Done](http://www.davidco.com/). I haven't personally read GTD (yet), but I use a system. Lately I've been having great success with [Workflowy](https://workflowy.com/), which I highly recommend.

### Weekly Status Email

Every week, summarize your activities from the previous week and send a status email to your manager. I recommend doing this on Monday rather than on Friday, but I haven't done any research to prove if either is superior. You may also just ask your manager which he or she prefers.

The details of this email are important. It must be a HTML mail, not plain text. It should have a heading for each active project with a bulleted list of your accomplishments under each project. There should be one category for any miscellaneous work. You should also have a section for any outstanding work items you have asked your manager to handle for you or the team.

Here is a sample status email I sent:

<img src="/images/2011/weekly_status_email_redacted_cropped.png" alt="Weekly status email sample">

Key things to note:

* Include your name and the date in the subject so it's easy to find all of these messages even after several months.
    * You can use the copies in your sent folder to help create your annual or semi-annual review information.
* You want to "goldilocks" this information. Too few bullet points and your manager won't have enough detail and will still come and bother you to follow up on minor points. Too much detail and he or she won't read it or will just skim it. You want just a few points per day; aim for between 10 and 20 bullet points in total.
* It may be difficult for developers to understand how much managers love weekly status emails. I'll avoid any off-color analogies but let's just say they find it deeply satisfying. More than once as a new manager took over my team and started receiving my weekly status emails, the manager turned around and asked everyone on the team to do the same.

### All-Nighters

A quick note here on pulling an all-nighter. All-nighters are not good. Generally all-nighters are amateur hour. They are a sign that things are being mismanaged and out of control. If you have to do these regularly, think about having a serious discussion with your manager about permanently fixing the problem, or think about looking for another job. However, at least a few times in your career, circumstances may truly necessitate an all-nighter. Hopefully this is not more than once every 18 months or so. So, if and when the time does come, my advice is to make sure you get credit for it. This can be something as simple as sending out a status email at 4am. This is another thing that will reflect positively upon your dedication, but if the right people have no awareness that you pulled an all-nighter, you won't get any credit for it.

## Performance Evaluations

Larger companies typically have formalized review processes every six or twelve months. These form the basis of salary and promotion decisions. Nailing your performance review is absolutely critical to getting those raises and promotions as soon as possible. Sadly, many people treat reviews as a nuisance of a bureaucratic red tape process, to be slogged through like so many TPS reports. And sadly for them, they miss a big opportunity. But gladly for you, with the advice in this guide, you will ace your reviews and go home with a bigger pay check.
Don't make the mistake of writing this process off. It's important and the level of effort you put into your part of it can easily make the difference between getting a $4,000 raise and getting a $24,000 raise. With that in mind, plan to spend at least half a day, if not more, working exclusively on preparing material for your performance review. When that time comes around, this is priority number one. Any other urgent issues and emails can wait. This is how you get paid, so allocate the time and get it right.

You want to prepare a document (again HTML email is strongly encouraged here) that you will send to your managers. This document should summarize your accomplishments and business impact since the previous performance review, or since your hire date if this is your first review. This document should include the following:

* A list of the projects/teams/products you have worked on this period
* A summary of significant accomplishments
* Statistics on some of your routine work, for example:
    * total count of bugs closed, for example
    * total count of tech support escalations resolved
    * total code reviews completed
* How your contributions had positive impact on the business.
    * Mention specific product releases, specific customer interactions, key sales, etc.
    * This is how you can demonstrate the contribution you are making to the business, which will directly support your manager's recommendation to give you a promotion or a raise or both.
* Your thoughts on how you intend to grow and improve
    * Be honest and candid here.
* How YOU want to have things be in the future
    * This is crucial. This is your chance to state your desires and intentions.
    * Just come right out with it. If you want to be a team lead within the next 3 months, say so. If you want to work from home on Fridays, this is the place to state that.

During the review your manager will likely have a basic agenda already set. There will be a slot on this agenda for you to review your work from the previous period and talk about your goals for your career. This is your chance to shine. Review your document verbally, adding additional details and color as needed.

There will be one or more standard forms that need to be filled in. Don't let the format of your company's standard document constrain you. Create your own document using the format above or some variation that expresses exactly what you want and exactly how you want to achieve it. You can then take the raw content from your custom document and copy/paste it into your company's standard document as needed. For reference, [here is a sample form of a typical annual performance review template](http://web.archive.org/web/20121102095657/http://service.govdelivery.com/docs/HRDOC/HRDOC_213/HRDOC_213_20020801_en.rtf).

### Tracking Your Performance Reviews Over Time

You should personally archive your performance review materials and have your own notes for reference. It seems that big companies like to switch performance management software about every three cycles, and whenever they switch, they usually are not able to migrate the data from the old system to the new system. Keeping your own copies and records will allow you to better track long term progress. You can also send a full record to a new manager if you are assigned to a new manager, which also happens fairly regularly. Thus you can get your new manager up to speed on where you started and where you want to be.

## Notes on Writing Well

[How to write without writing](http://www.codinghorror.com/blog/2011/02/how-to-write-without-writing.html)

### Key Points: Performance Reviews

* Prepare a complete, detailed, and thorough performance review document.
* Spend time verbally reviewing your work with your manager.
* Clearly articulate your short- and long-term career and lifestyle goals.
* Be a negotiator. Sometimes a manager's ability to increase your salary is strictly limited by policy. Ask instead for more vacation, more flexible working conditions, or any other non-monetary benefit you feel you have earned.

## Notes on Changing Companies

Most successful careers involve working for at least several different companies.  Just a few quick tips here.  Plan on changing companies as appropriate just maybe one or two times when the opportunity feels very compelling and the improved benefits are significant.  Be aware that frequent moving from company to company can be a major red flag to hiring departments that you are disloyal.  So just be aware of that as you are considering your options and think about the big picture.  Expectations vary by industry and company size here as well.  When the time is right, changing companies can get you a big salary increase ahead of schedule.  Of course, this is all part of "the game".  At the end of the day, you want to be enjoying your work and feeling fulfilled and inspired, and that matters more than the money.  These decisions are tough.  Consult your friends and family.  Don't get trapped in a rut in a bad job for a long time, and don't get in the habit of quitting every ten months.  Find that good middle ground that feels right for you.

# About the Author

Peter Lyons has worked as a software developer and technology consultant since 2001. His career is detailed [his career page](/career). He has worked at small (30 or fewer employees), medium (500 employees), and large (10s or 100s of thousands of employees) companies and consulted at many Fortune 500 businesses. As he learnt the skills described in this article, he was able to advance his career rapidly. Of course, if he had known at the beginning what he knows now, things might have advanced even more quickly.

## Exhibit A: Salary Chart

If you are uncertain about the veracity or value of the tips in this article, I offer up this graph of my salary as evidence in their favor. Assuming my starting salary straight out of college as "1" and computing the rest as multiples of that, here's what the growth looked like. Thus the chart doesn't show my specific earnings, just how they grew over time. This includes both base salary and cash bonuses. This does not include any form of stock, although I earned a bunch of that as well. By 2011 when I decided to take my career in a very different direction, I was earning over 4.6 times what I earned straight out of college.

<img src="/images/2011/salary_chart.png" alt="Bar chart of salary over time">

# Comments

Please share your responses to this article on my [blog post for this article](/problog/2011/05/leveling-up).
