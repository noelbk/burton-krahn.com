---
title: "Noel's Honeypot"
date: "2000-11-25"
tags:
  - "security"
  - "linux"
created: "2000-11-25"
modified: "2026-03-24"
---
Back to [Cracked, Wiped, Recovered, and Curious](../20001125-cracked-wiped-recovered).

After my machine was cracked, I decided to set up a honeypot instead of trying
to build a perfectly impenetrable system.

## Contents

- [My Network Setup](#my-network-setup)
- [Security Policy](#security-policy)
- [Routing to the Honeypot](#routing-to-the-honeypot)
- [Virtual Honeypots](#virtual-honeypots-with-vmware-and-vnc)

## Related Pages

- [Cracked, Wiped, Recovered, and Curious](../20001125-cracked-wiped-recovered)
- [My Pet Crackers](pets)
- [My Pet Cracker: Fone](fone/fone)
- [My Pet Cracker: blunt](blunt/blunt)

## My Network Setup

I had two machines which I referred to as `gateway` and `honeypot`.
`gateway` had two network interfaces: `eth0` was connected to the internet
through my ADSL modem, and `eth1` was connected to the other machine.
`honeypot` had one network interface connected to `gateway`.

`gateway` ran Red Hat 6.2 with a Linux 2.4.0-test10 kernel. `honeypot` was a
dual-boot Win98 and Red Hat 6.2 box.

```text
                   gateway
                  +-------------+
                  |eth0         |
internet ------>  |209.53.2.233 |      honeypot
                  |             |     +----------+
                  |eth1         |     |eth0      |
                  |10.0.0.1     |---->|10.0.1.5  |
                  +-------------+     +----------+
```

## Security Policy

My security policy for the network was:

- The gateway accepts a few protocols: `icmp`, `dhcp`, `ssh`, and `ident`.
- Connections from the honeypot to the gateway are rejected.
- All connections started from the gateway or honeypot to the internet are
  allowed.
- All other connections to the gateway are redirected to the honeypot.
- I monitor all traffic to the honeypot on `eth1`.

## Routing to the Honeypot

The trick was to transparently route everything not otherwise accepted to the
honeypot. Of course, if you have more than one real IP address you do not need
to do this, but this setup worked for me.

### Linux 2.4.x, iptables

```sh
#---------------------------------------------------------------------
# FORWARD and INPUT
#

# make a new rule set for both INPUT and FORWARD
iptables -N block
iptables -F block

# accept all connections that I start (this is like masquerading from
# the local host)
iptables -A block -m state --state ESTABLISHED,RELATED -j ACCEPT

# accept icmp, ident, dhcp, ssh
iptables -A block -p icmp -j ACCEPT
iptables -A block -p tcp --dport 113 -j ACCEPT
iptables -A block -p tcp --dport 22 -j ACCEPT
iptables -A block -p udp --sport 67:68 --dport 67:68 -j ACCEPT

# log and reject everything else
iptables -A block -j LOG
iptables -A block -j REJECT

# Jump to the "block" chain from INPUT and FORWARD chains.
iptables -F INPUT
iptables -A INPUT -j block

iptables -F FORWARD
iptables -A FORWARD -j block

# accept everything forwarded to my honeypot, and log connection starts
iptables -I FORWARD -d 10.0.1.5 -j ACCEPT
iptables -I FORWARD -d 10.0.1.5 -m state --state NEW,INVALID -j LOG

#---------------------------------------------------------------------
# NAT
#

# accept icmp, ssh, ident and dhcp
iptables -t nat -A PREROUTING -i eth0 -p icmp -j RETURN
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 113 -j RETURN
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 22 -j RETURN
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 67:68 -j RETURN

# route everything else to my honeypot
iptables -t nat -A PREROUTING -i eth0 -j DNAT --to 10.0.1.5

# masquerade my local network
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

### Linux 2.2.x, ipchains, ipmasqadm

I never tested the `ipmasqadm mfw` section myself. If you try it, let me know.

```sh
# accept icmp, dhcp, ident, ssh
ipchains -A input -p icmp -i $ext_dev -d $ext_ip/32 -j ACCEPT
ipchains -A input -p tcp --dport 22  -i $ext_dev -d $ext_ip/32 -j ACCEPT
ipchains -A input -p tcp --dport 113 -i $ext_dev -d $ext_ip/32 -j ACCEPT
ipchains -A input -p udp --sport 67:68 --dport 67:68 -j ACCEPT

# ipchains doesn't masquerade from the local host. I guess I have to
# allow connections from ftp-data and dns to any local port!
ipchains -A input -p tcp --sport 20  -i $ext_dev -d $ext_ip/32 1024: -j ACCEPT
ipchains -A input -p udp --dport 53  -i $ext_dev -s $ext_ip/32 -j ACCEPT
ipchains -A input -p udp --sport 53  -i $ext_dev -d $ext_ip/32 -j ACCEPT

# tcp connections (--syn) from outside: log, deny, and mark for the honeypot
ipchains -A input -l -p tcp --syn -m 1 -j DENY

# silently ignore UDP not addressed to me (broadcast and multicast packets)
ipchains -A input -p udp -i $ext_dev -d ! $ext_ip -j DENY

# all other udp: log, deny, and mark for the honeypot
ipchains -A input -l -p udp -m 1 -j DENY

# accept all tcp and icmp traffic routed back to me
ipchains -A input -i $ext_dev -d $ext_ip/32 -j ACCEPT
ipchains -A INPUT -p tcp --dport

# masquerade marked packets back to my honeypot
ipmasqadm mfw -m 1 -r 10.0.1.5

# masquerade everything from my local network out
ipchains -A FORWARD -S 10.0.0.0/8 -S 0.0.0.0/0 -j MASQ
```

### Linux 2.0.x, ipfwadm, ipportfw

`iptables`, `ipchains`, and `ipmasqadm` let you write rules which redirect
everything not otherwise accepted. `ipportfw` only sets up port forwarding for
specific ports. I guessed you would have to set up masquerading as usual, then
forward all of your vulnerable services manually.

## Virtual Honeypots With VMWare and VNC

If you are tight on budget and do not have spare machines, you could try
running your honeypot as a virtual machine. I had not done this myself, but the
idea was:

1. Set up [VMWare](http://www.vmware.com) with host-only routing and install
   your favourite honeypot OS.
2. If you do not run X all the time, use [VNC](http://www.uk.research.att.com/vnc/)
   to run a virtual X session for VMWare.
3. Set up port forwarding and masquerading to the VMWare machine just as if it
   were on an internal network.
