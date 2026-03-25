---
title: "Cracked, Wiped, Recovered, and Curious"
date: "2000-11-25"
description: "After my Linux box was cracked and wiped in 2000, I rebuilt it, investigated the attack, and set up a honeypot."
tags:
  - "security"
  - "linux"
created: "2000-11-25"
modified: "2026-03-24"
---
My interest in network security was renewed when my Linux box was cracked and
all of my working files were wiped out on Oct 10, 2000.

My Red Hat 6.2 box was reasonably secured with tcp-wrappers, ipchains, and a
few other basics, but I still left `http`, `ftp`, and `ssh` open for clients.
That was enough to let the bad guys in.

## Related Pages

- [How I set up my honeypot](cracked/honeypot)
- [My Pet Crackers](cracked/pets)
- [My Pet Cracker: Fone](cracked/fone/fone)
- [My Pet Cracker: blunt](cracked/blunt/blunt)

## Wiped Out

Looking at my logs, several different crackers had accounts on my computer from
at least a week before that. Some were using my machine as a base to attack
other systems. The last few entries in my logs were from system admins who were
angry that my machine was attacking them. One of the victims was the [Credit
Lyonnais Bank in Prague, Czech Republic](/static/site/cracked/letter-czech.txt).

I learned a few lessons from the experience:

- People get very angry when someone trespasses on their systems, and many want
  to attack back. However, most attacks come from previously compromised
  systems. I now believe that my system was wiped out not by the original
  cracker, but by a victim in retaliation. Retaliation is not the answer.
- Neither is law enforcement, at least not as I experienced it in 2000. My
  local police and the Canadian RCMP were totally unprepared to deal with the
  issue of cracking.
- Sending email to an ISP abuse address gets an automated response at best. On
  the occasions when I talked to abuse departments on the phone, they expressed
  genuine interest, but the daily number of port scans on my local network kept
  increasing anyway.
- I definitely felt blamed for leaving a security hole on my system. Many
  unsympathetic comments could be summed up as: "You were asking for it by
  flaunting your default configuration files."

## Recovering

I managed to restore most of my files from an old hard drive. My working files
were backed up on other servers. The hardest part of the whole affair was
telling my clients that their systems could be compromised through mine.
Rebuilding everything took a week.

I have calmed down a bit since then, but I still believed the recreational
crackers deserved more consequences than they were likely to face. So I started
gathering more information.

## Investigating

There are some really excellent accounts of cracker activity. These were some
of the references I recommended at the time:

- Cliff Stoll's excellent book, [_The Cuckoo's Egg_](https://www.simonandschuster.com/books/The-Cuckoos-Egg/Cliff-Stoll/9781668048160)
- [An Evening with Berferd](/static/site/cracked/berferd.txt)
- [An account of crackers at Texas A&M University](https://www.usenix.org/publications/library/proceedings/sec4/tamu.saf.html)
- Lance Spitzner's [Know Your Enemy](https://honeynet.onofri.org/papers/kye.html)

I found out the hard way that making a system impenetrable is impossible unless
you monitor it every day. I am just not diligent enough. So rather than trying
to build an impenetrable system, I decided to give crackers a place to play
with: a honeypot.

My honeypot ran stock Red Hat 6.2 with all services wide open. Here is [how I
set up my honeypot](cracked/honeypot) with Linux iptables and port forwarding. I
monitored all traffic to the honeypot with `tcpdump`.
[Ethereal](http://www.ethereal.com/) was an excellent tool for browsing packets.
It was also good for grabbing whole telnet sessions, and that is how I observed
[my pet crackers](cracked/pets).

The honeypot went live about Nov 12, 2000, running stock Red Hat 6.2 right out
of the box. By Nov 19, 2000, it had four new root accounts. The crackers got in
via `portmap`, `amd`, and `ftpd`, all well-known exploits. These were the
articles I linked at the time from CERT:

- [CA-2000-13: Two Input Validation Problems in FTPD](http://www.cert.org/advisories/CA-2000-13.html)
- [CA-2000-17: Input Validation Problem in rpc.statd](http://www.cert.org/advisories/CA-2000-17.html)
- [CA-99-12: Buffer Overflow in amd](http://www.cert.org/advisories/CA-1999-12.html)

These exploits were so old, even then, that there were many easily obtainable
programs which could scan whole networks for them and automatically exploit
them.

I think these tools were easily available because my current pet,
[fone](cracked/fone/fone), was a total novice. He could not even figure out how
to `rm -rf /var/log/*` at first.

## The Future

I would like to make our local networks more secure. Right now, each Internet
user is responsible for their own security. The police are powerless. It is the
wild west on the Internet. When we hear that someone gets hacked, we get
nervous, check our locks, and hope it does not happen to us.

I would like to take a more active role in catching and prosecuting crackers.

## Updates

- **2026-03-24:** Reformatted for Quartz, updated links, and added the
  <a href="/static/site/cracked/extract_telnet_sessions.py" download data-router-ignore>telnet session extraction script</a>.

