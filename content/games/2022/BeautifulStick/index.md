+++
title="Beautiful Stick"

[extra]
team="Brute Force"
thumbnail="thumbnail.png"
+++

<p> Beautiful Stick is a two-player game between a Drawer and a Stick-matcher.</p>

<p> The Drawer draws an NxN pixel picture using colors blue and red and it is the role of the Stick-matcher to design sticks and then use the sticks to match as many parts of the square as possible without overlap.</p>

<strong>Phases:
</strong> <br>
<ol>
    <li> The Stick-matcher looks away from the screen while the Drawer draws a picture. The Drawer can click any grid pixel on the website to change the pixel's color.
    </li>
    <li> Then the Stick-matcher suggests a single vector v of length L (where L &lt;= N) which we will call a stick. The stick also uses both red and blue colors. If the stick matches exactly vertically or horizontally in one or more places, the Stick-matcher is told where and how. For example, if v is of length three, then it might be (2,3) to (5,3), (1,2) to (4,2), ...). Repeat this process up to T times (T is at least 2).
    </li>
    <li> After T turns, the Stick-matcher specifies which sticks to use and where but cannot permit overlaps. So different sticks must use disjoint grid cells. Stick-matcher must click a pixel on the grid to specify the initial location of the stick and then click a second pixel on grid to specify the direction of the stick. Total points is the number of grid cells covered. The matched pixels will show with their color on the grid.
     </li>
</ol>






            