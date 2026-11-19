+++
title="Growth Race"

[extra]
team="Shichu Chen"
thumbnail="thumbnail.png"
+++

<h1 id="game-growth-race">Game: Growth Race</h1>
<h2 id="goal">Goal</h2>
<p>The goal is to grow your fish by collecting falling food while managing your mass-to-speed ratio effectively. The player with the highest mass when all food is consumed wins the game.</p>
<h2 id="rules">Rules</h2>
<ul>
<li>
<p>Initial Setup</p>
<ul>
<li>Each fish has an initial mass 100</li>
</ul>
</li>
<li>
<p>Mass</p>
<ul>
<li>Food has different mass values, increasing with size 10, 20, 30, 40, and 50.</li>
<li>The fish's mass increases by the food's mass when it eats the food</li>
<li>The fish's mass decreases by 3 every 50 time-steps but will not drop below its initial mass.</li>
</ul>
</li>
<li>
<p>Speed</p>
<ul>
<li>Speed is calculated based on mass:</li>
<li>V = V_0 / (M_fish^(2/3)) + V_min, where V_0 = 108</li>
<li>Heavier fish move slower</li>
</ul>
</li>
<li>
<p>Controls</p>
<ul>
<li>Player 1: WASD keys for movement</li>
<li>Player 2: JIKL keys for movement</li>
</ul>
</li>
<li>
<p>Shared Food Mechanics</p>
<ul>
<li>If both fish reach food simultaneously, the mass is split evenly</li>
</ul>
</li>
<li>
<p>End Condition</p>
<ul>
<li>Game ends when no more food drops from the surface</li>
</ul>
</li>
</ul>
