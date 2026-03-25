---
title: "My Pet Cracker: blunt"
date: "2000-12-09"
tags:
  - "security"
  - "linux"
created: "2000-12-09"
modified: "2026-03-24"
---
Back to [Cracked, Wiped, Recovered, and Curious](../../20001125-cracked-wiped-recovered).

This page tracked another repeat visitor to the honeypot, one who turned out to
be more competent than [fone](../fone/fone).

## Related Pages

- [Cracked, Wiped, Recovered, and Curious](../../20001125-cracked-wiped-recovered)
- [Noel's Honeypot](../honeypot)
- [My Pet Crackers](../pets)
- [My Pet Cracker: Fone](../fone/fone)

## Synopsis

- **Logins:** `a`, `b (uid=0)`
- **Passwords:** blank
- **Home Directory:** `/usr/lib/.blunt`
- **Observed IPs:**
  - `207.181.147.50` on `2000-11-26`
  - `38.37.0.36` on `2000-11-29`
- **Attack:** `sunrpc`, `portmap` on `2000-11-24`

## Diary

### Dec 09, 2000

blunt "secured" my system for me. He cleaned up the machine with this
[patch helper](/static/site/cracked/blunt/patch) and an
[ftp script](/static/site/cracked/blunt/update).

The original page also linked a `blunt.tar.gz` rootkit archive, but that file
is not present in the recovered source tree.

At the time I wondered whether he was a good Samaritan who hacked insecure
systems and cleaned them up, or just a hacker who wanted privacy.

Extracted session text:

- [975117774-session.txt](/static/site/cracked/blunt/975117774-session.txt)

### Nov 29, 2000

blunt came back.

Extracted session text:

- [2000-11-29-session.txt](/static/site/cracked/blunt/2000-11-29-session.txt)

He finally found [`hunt`](/static/site/cracked/bin/hunt) and `fortune` and
managed to remove them. I still do not think he understood how they worked.

Poor [fone](../fone/fone). blunt wiped out his home directory.

I also sent notices to `postmaster@YORKCITY.ORG`, `postmaster@NETRAX.NET`, and
`postmaster@psi.com` to see how long it would take them to respond.

### Nov 26, 2000

blunt looked a little sharper than [fone](../fone/fone). He got
in through `sunrpc`, checked whether he had been there before, then unpacked a
toolkit in `/dev/.blunt`.

The original page linked a tcpdump for this visit as well. That capture is also
missing from the recovered archive, though the page recommended this fallback
command for inspecting the traffic:

```sh
tcpdump -nr 975117774.tcpdump -w - | strings
```
