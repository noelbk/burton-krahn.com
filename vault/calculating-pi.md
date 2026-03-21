---
title: "Calculating π with Archimedes' Method of Exhaustion"
category: "math"
date: "2026-03-19"
created: "2026-03-11"
modified: "2026-03-19"
---

```tikz
\begin{document}

% Polygon colour palette (adjust here)
\definecolor{polyA}{RGB}{20,60,180}      % square: deep blue
\definecolor{polyB}{RGB}{30,120,120}     % octagon: blue/green blend
\definecolor{polyC}{RGB}{20,160,80}      % 16-gon: greenish
\colorlet{polyAop}{polyA!100!white}  % fully opaque
\colorlet{polyBop}{polyB!80!white}   % slightly faded
\colorlet{polyCop}{polyC!60!white}   % more faded

\begin{tikzpicture}[scale=4,
    >=latex, 
    every node/.style={font=\large}, 
    polygon/.style={line width=1pt}]

  % radius of circle
  \def\R{1.0}
  % half-side of the inscribed square
  \pgfmathsetmacro{\s}{\R/sqrt(2)}

  %--- main points -------------------------------------------------
  \coordinate (O) at (0,0);          % centre of circle
  \coordinate (A) at (-\s,-\s);
  \coordinate (B) at ( \s,-\s);
  \coordinate (C) at ( \s, \s);
  \coordinate (D) at (-\s, \s);      % square vertices

  % midpoint of top side (still used for construction)
  \coordinate (M) at (0,\s);

  % regular octagon (for the subdivided square)
  \foreach \k in {0,...,7}{
    \coordinate (P\k) at ({\R*cos(45*\k)},{\R*sin(45*\k)});
  }

  % refined 16-gon
  \foreach \k in {0,...,15}{
    \coordinate (Q\k) at ({\R*cos(45*\k/2)},{\R*sin(45*\k/2)});
  }
  
  %--- circle and polygons -----------------------------------------
  \draw[polygon] (O) circle (\R);
  
  \draw[polygon, polyAop] (A)--(B)--(C)--(D)--cycle;           % inscribed square

  % highlight full top side as l_0, label shifted left
  \draw[polygon] (D) -- (C);
  \path (D) -- (C) node[pos=0.70, below] {$\ell_0 = \sqrt{2}$};

  % dashed octagon (subdivided polygon)
  \draw[polyBop] (P0)--(P1)--(P2)--(P3)--
                 (P4)--(P5)--(P6)--(P7)--cycle;

   % l1 on octagon
   \draw[polygon] (P2) -- (P1);
   \path (P2) -- (P1) node[pos=0.4, below] {$\ell_1$};

   % 16-gon (subdivided polygon)
   \draw[polyCop] (Q0)--(Q1)--(Q2)--(Q3)--
                  (Q4)--(Q5)--(Q6)--(Q7)--
                  (Q8)--(Q9)--(Q10)--(Q11)--
                  (Q12)--(Q13)--(Q14)--(Q15)--
                  cycle;
 
 
   % l2 on 16-gon
   \draw[polygon] (Q3) -- (Q2);
   \path (Q3) -- (Q2) node[midway, above right] {
     $\ell_{i+1} = \sqrt {2} \sqrt {1 - \sqrt{1 - {{\ell_i}^2 \over 4}} }$
     };

  %--- radii and vertical construction inside the circle -----------

  % top of circle
  \coordinate (T) at (0,\R);

  % radius up
  \draw (O) -- (T);
  \path (O) -- (T) node[midway, left] {$1$};

  % radius to square corner
  \draw (O) -- (C);
  \path (O) -- (C) node[midway, right] {$1$};
  \draw (O) -- (D);
  \path (O) -- (D) node[midway, left] {$r = 1$};

  % tiny right-angle box at the origin, rotated so it sits between the two lines
  \begin{scope}[shift={(0,0)}, rotate=45]
    \draw (0,0) -- (0.08,0) -- (0.08,0.08) -- (0,0.08) -- cycle;
  \end{scope}

  % vertical from midpoint M to top T
  \draw (M) -- (T);

  % little right-angle mark near M on the top side
  \draw (M) ++(0.06,0) -- ++(0,0.06) -- ++(-0.06,0);

  % label the vertical pieces a and b
  \path (O) -- (M) node[midway, right] {$a$};
  \path (M) -- (T) node[midway, right] {$b$};

  % triangle used for l_1: from T to C
  \draw (T) -- (C);

\end{tikzpicture}
\end{document}

```

This is a nice geometrical way to approximate $\pi = {P \over 2r}$, the ratio of a circle's preimeter $P$ to its diameter $2r$, where $r$ is its radius. This is not the most efficient way to calculate $\pi$, but Archimedes' method of exhaustion is nice and elegant. It's also a nice excuse to play with [Tikz](https://tikz.net/).

This method approximates the diameter of a circle by inscribing finer and finer regular polygons inside. If we know the length of a side of a regular polygon with $n$ sides, then we can subdivide each side in half and derive the length of a side of a polygon with $2n$ sides.

Consider the diagram above. Let's start with a square inside a circle of radius $r=1$. The length of one of its sides is $\ell_0 = \sqrt 2$. Its perimeter is $4 \sqrt{2}$, so our first approximation $\pi_0$ is $4\sqrt{2} / 2 = 2\sqrt{2} \approx 2.8$. Not very close, but we'll refine it by subdivision.

Next we subdivide the square into an octagon by subdividing each side. What is the length of one side of the octagon, $\ell_1$? Can we derive an expression for $\ell_1$ in terms of $\ell_0$?

The trick is using Pythagoras' Theorem or right triangles that $a^2 + b^2 = r^2$ to derive the lengths $a$ and $b$ in the diagram above to derive $\ell_1$ in terms of $\ell_0$.

From the diagram, we can see:

$$
\begin{align}
  \ell_0 &= \sqrt{2}\\
  a + b &= 1 \\
  b^2 + {\left( \ell_0 \over 2 \right) }^2 &= {\ell_1}^2 \\
  {\left( \ell_0 \over 2 \right)}^2 + a^2 &= 1 \\
  \implies a^2 &= 1 - {{\ell_0}^2 \over 4} \\
  \implies a &= \sqrt{1 - {{\ell_0}^2 \over 4}} \\
\end{align}
$$

Solving for $\ell_1$ in terms of $\ell_0$:

$$
\begin{align}
  {\ell_1}^2 &= {\left( \ell_0 \over 2 \right)}^2 + b^2 \\
    &= {{\ell_0}^2 \over 4} + (1-a)^2 \\
    &= {{\ell_0}^2 \over 4} + 1 - 2a + a^2 \\
    &= \cancel{{{\ell_0}^2 \over 4}} + 1 - 2 \sqrt{1 - {{\ell_0}^2 \over 4}} + 1 \cancel{- {{\ell_0}^2 \over 4}} \\
    &= 2 \left( 1 - \sqrt{1 - {{\ell_0}^2 \over 4}} \right) \\
\end{align} 
$$

This method of subdividing generalizes from $\ell_i$ to $\ell_{i+1}$.

$$
\begin{align}
  \ell_{i+1} &= \sqrt{2} \sqrt{ 1 - \sqrt{1 - {{\ell_i}^2 \over 4}} } \\
\end{align} 
$$

Putting it all together for our approximations $\pi_i$:

$$
\begin{align}
  n_0 &= 4 \\
  \ell_0 &= \sqrt{2} \\
  \pi_i &= n_i \ell_i / 2 r\\
  \pi_{i+1} &= 2n_i \sqrt{2} \sqrt{ 1 - \sqrt{1 - {{\ell_i}^2 \over 4}} } \\
\end{align} 
$$

Below is a little Python program that computes a few approximations. Note it stops after 13 iterations with only 10 digits of $\pi$ because Python's floating point numbers run out of precision to go further.

|   i | $\pi_i$    |
| --: | ---------- |
|   0 | 2.8        |
|   1 | 3.1        |
|   2 | 3.1        |
|   3 | 3.14       |
|   4 | 3.14       |
|   5 | 3.141      |
|   6 | 3.1415     |
|   7 | 3.1416     |
|   8 | 3.14159    |
|   9 | 3.14159    |
|  10 | 3.141592   |
|  11 | 3.1415926  |
|  12 | 3.1415926  |
|  13 | 3.14159265 |

```python
#! /usr/bin/env python3
'''arch_pi.py - Use Archimedes method to approximate pi
'''

from math import sqrt, pi, log10, floor

# l_0 = sqrt(2)
#
# l_{i+1}^2 = 2 * (1 - sqrt(1 - l_{i}^2 / 4)))
#
# pi_{i+1} = n_{i+1} * sqrt(l_{i+1}^2) / 2

def arch_pi():
    # start with a square in the circle
    # Number of sides of the polygon, 4 for a square
    n = 4

    # l2 is the length of one side of the polygon, squared.
    # For a square inside a circle or radius 1, the square's side length is sqrt(2), so l2 = l^2 = 2
    l2 = 2
    
    while True:
        # approximate pi by the perimeter of the polygon divided by the diameter:
        # = sides * sqrt(l2) / 2 * radius
        pi_i = n * sqrt(l2) / 2
        yield pi_i
        l2 = 2 * (1 - sqrt(1 - l2 / 4))
        n *= 2
        
if __name__ == '__main__':
    print("|  i  | $\\pi_i$    | error |")
    print("|----:|------------|-------|")
    for i, pi_i in enumerate(arch_pi()):
        err = abs(pi_i - pi)
        digits = max(2, -floor(log10(err)))
        if i>0 and err > err_last:
            print(f'error is inrceasing now to err={err:.0e}.  The last was the best I can do')
            break;
        print(f'| {i:3} | {pi_i:.{digits}} | {err:.0e} |')
        err_last = err
```

