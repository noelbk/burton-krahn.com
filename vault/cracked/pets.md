---
title: "My Pet Crackers"
date: "2000-12-09"
tags:
  - "security"
  - "linux"
created: "2000-12-09"
modified: "2026-03-24"
---
Back to [Cracked, Wiped, Recovered, and Curious](../20001125-cracked-wiped-recovered).

After putting up my honeypot, I started watching the people who logged into it
and documenting what they did. This page was the summary page for that little
rogues' gallery.

## Related Pages

- [Cracked, Wiped, Recovered, and Curious](../20001125-cracked-wiped-recovered)
- [Noel's Honeypot](honeypot)
- [My Pet Cracker: Fone](fone/fone)
- [My Pet Cracker: blunt](blunt/blunt)

## News

- **2000-12-09:** [blunt](blunt/blunt#dec-09-2000) secured my
  system for me. Thanks, but no thanks.
- **2000-11-29:** [blunt](blunt/blunt#nov-29-2000) came back,
  patched my system binaries, found `/usr/bin/hunt`, and wiped out
  [fone](fone/fone)'s home directory.

## Introduction: It Beats Tamagotchi!

On Nov 12, 2000, I put up my [honeypot](honeypot) and monitored
it with `tcpdump`. I was an amateur at network security and wanted to see for
myself how crackers operated. By Nov 26, 2000, my honeypot had five extra root
accounts. Two of them, [fone](fone/fone) and
[blunt](blunt/blunt), were actively telnetting into the
honeypot.

It was like having a cockroach ranch. My pet crackers confirmed the common
cracker image I had at the time: they did not seem very bright, and their only
motivation was cracking as many systems as possible.

## Observations

- They used well-published exploits like `rpc`, `amd`, and `wu-ftp` to get in.
- Each cracker might connect from several different IPs, presumably previously
  compromised systems. It seemed worth collecting the IPs so I could warn the
  admins.
- Once in the system, they were surprisingly incurious about what it contained.
  I even put some of my old files on the honeypot to keep their interest, and
  they were oblivious.
- Their main goal seemed to be learning about cracking. My first pet,
  [fone](fone/fone), could not even do
  `rm -rf /var/log/*` at first.
- Eventually, fone figured out how to remove the logs, clumsily, and replace
  the system binaries. I thought this was clever until I saw what he actually
  did:

```sh
mv /bin/ps /bin/.ps
printf '#! /bin/sh\n/bin/.ps | sed -d [fFone]\n' > /bin/ps
```

- I assumed they would eventually try to crack other systems from my honeypot.
  Was that really the whole goal, to mindlessly compromise as many systems as
  possible?

## Reading My Tcpdump Files

The detailed pages for [fone](fone/fone) and
[blunt](blunt/blunt) include the observations I kept from
their sessions.

I recorded all traffic to the honeypot with `tcpdump` like this:

```sh
tcpdump -n -e -l -p -vv -s 2000 -w $(date +"%s").tcpdump -i eth1 > out 2>&1 &
```

You could then inspect one of the files with [Ethereal](http://www.ethereal.com):

```sh
ethereal -nr xxxx.tcpdump
```

At the time there were also known issues with some Red Hat `tcpdump` files.
If your `tcpdump` program could not read one of mine, Ethereal or `editcap`
were the tools I recommended trying.

I also wrote a small script to reconstruct and clean these recovered telnet
sessions: <a href="/static/site/cracked/extract_telnet_sessions.py" download data-router-ignore>extract_telnet_sessions.py</a>.
