+++
title="Adventure of a Lifetime"

[extra]
team="Aditya and Gokul"
thumbnail="thumbnail.png"
+++

<h1 id="path-finding-game-in-a-grid-with-a-twist">Path-finding Game in a Grid with a Twist</h1>
<h2 id="rules">Rules</h2>
<ul>
<li><strong>Two-player game</strong> with 2 Stages. In the 1st Stage -
<ul>
<li>Player 1 starts from the <strong>top right</strong> corner.</li>
<li>Player 2 starts from the <strong>bottom left</strong> corner.</li>
</ul>
</li>
<li><strong>Objective</strong>: The player with the highest number of points after 2 stages wins the game.</li>
<li><strong>Different Kinds of Cells</strong>: Treasure, Wall, Teleport and Thief cells.</li>
<li>After the first stage, the <strong>start positions of the players are swapped</strong> to ensure fairness in the game.</li>
<li>Each stage ends when a player starting from one corner of the grid reaches the <strong>diagonally opposite corner</strong>. The second stage will have the same placement of cells as the first stage.</li>
</ul>
<h2 id="scoring">Scoring</h2>
<p>Players can gain points in two ways:</p>
<ol>
<li><strong>Collecting a coin</strong>: Moving into a Treasure cell increases your score by 1 point.</li>
<li><strong>Stealing points</strong>: Moving into the Thief cell located at the center of the grid allows the player to steal 1 point from the other player. Note that there is just a single Thief cell per stage on the grid.</li>
</ol>
<p>If the <strong>scores of both players are equal after a stage</strong>, the <strong>first player to reach their opposite corner gets 1 extra point</strong>.</p>
<h2 id="movement">Movement</h2>
<ul>
<li>Players can move across grid cells in <strong>four directions</strong>:
<ul>
<li><strong>Up, Down, Left, Right</strong></li>
<li>In order to move, either press the direction arrow keys on your keyboard or click the direction buttons on the screen.</li>
</ul>
</li>
<li><strong>Restrictions</strong>:
<ul>
<li>Players <strong>cannot pass through Wall cells</strong>.</li>
<li><strong>Teleport cells</strong> allow players to move to another Teleport cell via mouse click.</li>
</ul>
</li>
</ul>
<p><strong>NOTE</strong> - Please open the game in Popup Window for larger grid sizes.</p>
