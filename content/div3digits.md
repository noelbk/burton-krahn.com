Title: If a number is divisible by 3, then so is the sum of its digits
Date: Oct 3, 2016
Category: Math
Summary: A toy proof of a math trick I learned in elementary school.

# Preamble

This is a toy proof of a math trick I learned in elementary school.
It's really Just an excuse to play with
[$\LaTeX$](https://www.latex-project.org/).

This document is also available as
[PDF]({filename}static/div3digits.pdf) and $\LaTeX$
[source]({filename}static/div3digits.tex).

# Introduction

There was a trick we learned in elementary school: if the sum of the
digits of a number is divisible by 3, then the number itself is
divisble by 3.

**Example:** Is $54,321$ divisible by $3$?  The sum of digits $5 + 4 + 3
+ 2 + 1 = 15$, which is divisible by $3$, so $54,321$ should be divisible
by $3$ according to this rule, and yes, $54,321 = 3 \cdot 18,107$.

Is that true for all numbers?

# Proving it

We write numbers as strings of decimal digits like so:

$$
\begin{align*}
  54,321 & = 5 \cdot 10,000 + 4 \cdot 1,000 + 3 \cdot 100 + 2 \cdot 10 + 1 \\
         & = 5 \cdot 10^4   + 4 \cdot 10^3 + 3 \cdot 10^2 + 2 \cdot 10^1 + 1 \cdot 10^0
\end{align*}
$$

More precisely, we write an integer $D$ as a string of decimal digits:
$d_{n-1},{\ldots},d_1,d_0$, which represents the equation:

$$
\begin{align*}
  D & = d_{n-1} 10^{n-1} + \cdots + d_1 10^1 + d_0 10^0 \\
    & = \sum_{i=0}^{n-1} d_i 10^i
\end{align*}
$$

Given that definition of the digits of a number, we can prove the
theorem.  First, a couple of mini-theorems:

**Lemma 1:** For all integer polynomials, $(x+1)^n = x k_n + 1$ for
some integer $k_n$.  In other words, $(x+1)^n - 1$ is divisible by
$x$.

**Proof:** By induction. First the base case where $n=0$:

$$
\begin{align*}
    (x+1)^0 & = 1 \\
            & = x \cdot 0 + 1
\end{align*}
$$

So for the base base, $k_0 = 0$.
 
Now, the inductive step.  Assuming $n$, prove $n+1$:

$$
\begin{align*}
(x+1)^{n+1} & = (x + 1)(x + 1)^n \\
           & = (x + 1)(x k_n + 1) && \text{assuming $n$: $(x+1)^n = x k_n + 1$} \\
           & = x x k_n + x + x k_n + 1 \\
           & = x(x k_n + k_n + 1) + 1 \\
           & = x(k_{n+1}) + 1 && \text{where $k_{n+1} = x k_n + k_n + 1$}
\end{align*}
$$

We've proven the $n+1$ case: $(x+1)^{n+1} = x k_{n+1} + 1$, and by
induction this is be true for all $n \ge 0$.
$\square$

**Lemma 2:** If $D = p k + q$, then $D$ is divisible by $p$ if and
only if $q$ is divisible by $p$.

**Proof: ** Assume $q$ is divisible by $p$.  Then, $q = p j$ for some
integer $j$, and

$$
\begin{align*} 
D & = p k + q \\
  & = p k + p j \\
  & = p (k + j)
\end{align*} 
$$

thus $D$ is divisible by $p$.

Now, assume $q$ is {\bf not} divisible by $p$.  Then, $q = p j + r$ for some $0 < r < p$, and 

$$
\begin{align*} 
D & = p k + q \\
  & = p k + p j + r \\
  & = p (k + j) + r
\end{align*} 
$$

and since $0 < r < p$, $D$ is {\bf not} divisible by $p$.

Thus $D = p k + q$ is divisible by $p$ if and only if $q$ is divisible by $p$.
$\square$

Now we can get back to the main theorem.

**Theorem:** If an integer $D$ is written as a string of digits
$d_{n-1},\ldots,d_1,d_0$ where $D = \sum_{i=0}^{n-1} d_i 10^i$, then
$D$ is divisible by 3 if and only if the sum of its digits $S =
\sum_{i=0}^{n-1} d_i$ is divisible by 3.


**Proof:** The proof uses the simple fact that $10 = (9 + 1)$:

$$
\begin{align*}    
D & = \sum_{i=0}^{n-1} d_i 10^i \\
  & = \sum_{i=0}^{n-1} d_i (9+1)^i \\
  & = \sum_{i=0}^{n-1} d_i (9k_i+1) && \text{by Lemma 1}\\
  & = 9\sum_{i=0}^{n-1} d_i k_i + \sum_{i=0}^{n-1} d_i\\
  & = 9k + S && \text{where $S$ is the sum of the digits of $D$}
\end{align*}
$$

So $D = 9k + S$, and by Lemma 2, $D$ is divisible by 9 if and only if
the sum of its digits, $S = \sum_{i=0}^{n-1} d_i$ is also divisible by
9.  That's an interesting result, but we were trying to prove that
statement for 3.  However, since $9 = 3 \cdot 3$:

$$
\begin{align*}    
D & = 9k + S \\
  & = 3 \cdot 3 k + S \\
  & = 3 j + S
\end{align*}
$$

Lemma 2 works again to prove that $D$ is divisible by 3 if and only if
the sum of its digits, $S = \sum_{i=0}^{n-1} d_i$ is also divisible by
3.
$\square$

## Epilogue

This proof used the fact that we write integers in base 10, and $10 =
(9+1)$, and thus if the sum of a number's digits in base 10 is
divisible by 9 or 3, then so is the number itself.  This works for
other bases too.  For example, if the number's digits are in base 8,
this rule will work for all divisors of $8 - 1 = 7$.  For example,
$5432_8 = 2842_{10} = 7 \cdot 406_{10}$, and $5+4+3+2 =
14_{10}\checkmark$
