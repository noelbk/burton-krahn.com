---
title: "Great Circle"
category: "programming"
date: "2026-03-19"
created: "2026-03-11"
modified: "2026-03-19"
---

Having fun with [Threejs](http://www.threejs.org): You're a red blob on a blue sphere.  Move the mouse to set your direction, and see the sphere rotate underneath you.  Direction is set by the tangent which determines the quaternion that rotates the sphere..

```dataviewjs
// quartz-iframe | title: Great Circle demo | style: width:100%;height:75vh;border:0;display:block
let iframe = this.container.createEl("iframe");
iframe.src = app.vault.adapter.getResourcePath("static/greatcircle/greatcircle/index.html");
iframe.style.cssText = "width: 100%; height: 75vh; border: 0; display: block;";
iframe.title = "Great Circle demo";
```

