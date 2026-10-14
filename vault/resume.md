---
title: "Projects and Resume"
date: "2017-03-10"
modified: "2026-10-14"
---

## Noel Burton-Krahn — code samples

I’m a scientific software engineer and consultant working in C++ and Python, with experience in biomedical signal processing, scientific instruments, and distributed systems. Here are some samples of my own code from favourite past projects.

- [Resume PDF](static/NoelBurtonKrahnResume.pdf)
- [GitHub](https://github.com/noelbk)

### PQRST: Detecting P, QRS, and T Waves in an ECG

[Read the full article](20260615-ecg-pqrst)

<a href="./20260615-ecg-pqrst" style="display:block;width:293px;max-width:100%;height:132px;overflow:hidden;border-radius:5px"><img src="/static/site/20260615-ecg-pqrst/MO1_001_HE_pqrst.png" alt="Annotated ECG beats with detected P, QRS, and T waves" width="650" style="width:650px;max-width:none;margin:0;transform:translate(-40px,-57px)" /></a>

I developed a geometric PQRST delineation algorithm for HeartEye’s 12-lead ECG device, revisiting my original work from 1997. The article shows how the algorithm identifies P and T waves and distinguishes irregular rhythms through RR and PQ variability.

### Genetisnake (genetic programming, Three.js, Phoenix)

[Read the full article](battlesnake2017)

[![Battlesnake game board](static/battlesnakes/battlesnakes.png)](static/battlesnakes/)

Battlesnake is an AI competition where snakes compete to survive on a simple board. My entry used [genetic programming](https://en.wikipedia.org/wiki/Genetic_programming). I rendered the board with [Three.js](https://threejs.org/), and the game server was a multi-room chat application written in [Phoenix](http://www.phoenixframework.org/).

### GKViewer Video Recording and Playback (C++, OpenGL, ActiveX)

[![GKViewer video review application](static/gkviewer-screenshot-2-200.jpg)](static/gkviewer-screenshot-2.jpg)

This was a multi-camera digital video recording and playback system. The code cross-compiled on Linux and Windows to save and display video on a Linux recording unit, and to play back on Windows through an ActiveX component written in C++ using OpenGL.

- Main class for the player: [`glplayer.h`](static/glplayer.h), [`glplayer.cpp`](static/glplayer.cpp)
- GLActor for video: [`glactorvideo.h`](static/glactorvideo.h), [`glactorvideo.cpp`](static/glactorvideo.cpp)
- ActiveX wrapper: [`GLPlayerCtlCtrl.h`](static/GLPlayerCtlCtrl.h), [`GLPlayerCtlCtrl.cpp`](static/GLPlayerCtlCtrl.cpp)
- Real-time scheduling: [`task.h`](static/task.h), [`task.cpp`](static/task.cpp)

### Hotswap — Transparent Failover for Linux (C++, linux kernel)

[Read the full article](20020226-transparent-failover)

<a href="./20020226-transparent-failover"><img src="/static/site/hotswap-thumbnail.png" alt="HotSwap architecture: synchronized master and backup hosts preserving client connections" width="320" /></a>

My Master's project was to replicate Linux process trees between servers, so one server could seamlessly take over from another without losing data or breaking network connections.

- [LISA'02 paper](lisa02.pdf)

### Page Flipping (Java, OpenGL)

![Java page flipping applet](static/pageflip-200.png)

This is a Java applet I worked on as a prototype for a photo album application.

`Planed.java` computes a transformation matrix for flipping the OpenGL model matrix across a plane:

- [`Planed.java`](static/pageapplet/Planed.java)

### P2PVPN (C/C++, wxWidgets)

[![P2PVPN UI](static/p2pvpn-screens-connect-200.png)](static/p2pvpn-screens-connect.png)

P2PVPN is a peer-to-peer firewall-tunneling VPN. It connects peer computers through firewalls like Skype does, but instead of voice conferencing, P2PVPN creates a virtual ethernet interface and gives peers virtual IP addresses for each other.

- Client daemon: [`p2p_peer.h`](static/p2p_peer.h), [`p2p_peer.c`](static/p2p_peer.c)
- Desktop UI: [`p2p_ui_frame.h`](static/p2p_ui_frame.h), [`p2p_ui_frame.cpp`](static/p2p_ui_frame.cpp)
- Library: [wxWidgets](http://wxwidgets.org/)

### Web Server / Database Applications

![Simple HTML graph](static/bofgraph-200.png)

Most of my bread and butter work is making web servers and distributed systems with Python ([`djselect.py`](static/djselect.py), [`expand.py`](static/expand.py)), C#, Groovy, Java, Erlang, Phoenix, Django.

Cloud computing and devops: AWS, Docker, Kubernetes, consul, etcd.  
Databases: MySQL, PostgreSQL, SQL Server, DB2  
Version control: Git, Subversion, Mercurial

