---
title: "My Pet Cracker: Fone"
date: "2000-11-26"
tags:
  - "security"
  - "linux"
created: "2000-11-26"
modified: "2026-03-24"
---
Back to [Cracked, Wiped, Recovered, and Curious](../../20001125-cracked-wiped-recovered).

This page tracked one of the people who repeatedly logged into my honeypot in
late 2000.

## Related Pages

- [Cracked, Wiped, Recovered, and Curious](../../20001125-cracked-wiped-recovered)
- [Noel's Honeypot](../honeypot)
- [My Pet Crackers](../pets)
- [My Pet Cracker: blunt](../blunt/blunt)

## Synopsis

- **Login:** `Fone`, `Fone1 (uid=0)`
- **Password:** `CCITT5`
- **Home Directory:** `/dev/.Fone`
- **Observed IPs:** `198.139.158.172`, `211.43.92.125`, `207.193.0.126`,
  `63.28.15.252`, `63.28.47.44`, `209.47.102.209`

## Diary

### Nov 19, 2000

Fone broke into my [honeypot](../honeypot) on Nov 19, 2000 from
`198.139.158.172`, then telnetted in from `211.43.92.125`.

Extracted session text:

- [974534774-session.txt](/static/site/cracked/fone/974534774-session.txt)

### Nov 20, 2000

Someone told him to erase the log files, but he still could not figure out how
to do it.

Extracted session text:

- [974771110-session.txt](/static/site/cracked/fone/974771110-session.txt)

### Nov 23, 2000

Good boy, spot. He finally figured out `rm -rf /var/log`.

Extracted session text:

- [975002946-session.txt](/static/site/cracked/fone/975002946-session.txt)

On Nov 20, I decided that fone was not spending enough time on my system, so I
tried to pique his interest by taunting him. I modified his shell to print a
fortune and play a hotter-colder hidden-directory game using
[`hunt`](/static/site/cracked/bin/hunt):

```sh
PS1='\n$(/usr/games/fortune)\n$(/usr/games/hunt)\n'"$PS1"
EOF
```

It worked. He started typing things like `HAI LAR` and `HACKER?` at the prompt,
waiting for this mysterious overseer to respond.

## Notes

These extracted session texts come from the recovered `*.tcpdump.gz` files. The
transcripts are a little noisy because they were reconstructed from packet
payloads rather than preserved original terminal logs, but they are readable and
capture the command flow.
