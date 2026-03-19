---
title: "Calculating π with Archimedes' Method of Exhaustion"
category: "math"
---

## Calculating $\huge\pi$ with Archimedes' Method of Exhaustion

![TikZ diagram](/static/site/generated/tikz/calculating-pi-tikz-01-e3948c6edbd4.png)

<details class="tikz-source">
<summary>TikZ source</summary>
<div class="tikz-source__controls">
<button type="button" onclick="(async(btn)=>{try{await navigator.clipboard.writeText(document.getElementById('tikz-src-calculating-pi-01-e3948c6edbd4').value);btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy to clipboard',1200)}catch(e){}})(this)">Copy to clipboard</button>
</div>
<textarea id="tikz-src-calculating-pi-01-e3948c6edbd4" class="tikz-source__textarea" readonly>\begin{document}

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
\end{document}</textarea>
<pre class="tikz-source__pre"><code>\begin{document}

% Polygon colour palette (adjust here)
\definecolor{polyA}{RGB}{20,60,180}      % square: deep blue
\definecolor{polyB}{RGB}{30,120,120}     % octagon: blue/green blend
\definecolor{polyC}{RGB}{20,160,80}      % 16-gon: greenish
\colorlet{polyAop}{polyA!100!white}  % fully opaque
\colorlet{polyBop}{polyB!80!white}   % slightly faded
\colorlet{polyCop}{polyC!60!white}   % more faded

\begin{tikzpicture}[scale=4,
    &gt;=latex, 
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
\end{document}</code></pre>
</details>


