+++
title="Jump Snatch"

[extra]
team="Team GG (Shashaank Gupta, Yifan Jin)"
thumbnail="thumbnail.png"
+++

## Instructions

<p> You are given a board of size <strong> n x n </strong> (where n is at least 3) with some number of pieces randomly put there.</p>

<p> <strong> Goals: </strong>  
</p>

- Your goal is to produce a board with only one piece left using the smallest number of slide and/or jump moves. 
- Each player wants to be the last one to do a jump.

<p></p>

<p> <strong> Rules: </strong> 
</p>

- A move consists of a slide or a jump move.
- A slide moves a piece a single square in either a vertical, horizontal or diagonal direction provided the destination square is empty.
- A jump move consists of one or more jumps using the same piece. A player may stop a jump move after at least one jump even if more jumps are possible. A piece p1 can jump a piece p2 if p2 is between p1 and an empty square along any vertical, horizontal, or diagonal direction. When a piece (e.g. p2) is  jumped, it is removed.
- The players alternate moves.
- If a jump is not possible, then the player must slide a piece in such a way as to make a jump possible if that can be done, or the slide
must reduce the minimum of the pairwise distances between pieces. (Here, the distance between two pieces p1 and p2 is measured as the 
minimum number of diagonal, horizontal, or vertical moves to slide from p1 to p2. The pairwise distances are the set of distances between
all pairs of pieces.)
<p></p>
    
## Examples

</p><p>
<ul>
<li> Consider the following configuration here a dot means empty space and "x" means a piece. <br> <br>

<pre>
. x x
. x x 
. . .
</pre>

Is there any way to ensure that only one piece will be left standing after one jump move? <br> <br>

Here is one way. Start at the upper right corner. Jump down to the lower right corner. Then jump diagonally up to the upper left corner.
Finally, jump to the upper right corner.
</li>

<li> If player A goes first and B goes second, which player will win on
the following initial board? <br> <br>

<pre>
x x .
. . . 
. x x 
</pre>

Player B wins. After each player moves once, the configuration
will be <br> <br>

<pre>
. . x
. . .
x . .
</pre>

Now, player A must slide closer to player B. The only such move is
to go to the center. No other move reduces the distance (which is
measured
in the number of slides to go from one to the other).
</p>
</li>