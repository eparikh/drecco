+++
title="Heavy Rain"

[extra]
team="Sam de Alfaro"
thumbnail="thumbnail.png"
+++

<h1 id="rules">Rules</h1>
<p>Heavy Rain is a multiplayer game where players drop weighted raindrops down a grid to collect water and get the weight of the drops that reach the bottom.</p>
<p><strong>Setup:</strong> Each player receives raindrops weighted 1 through 7 (one of each weight). The board contains water droplets (5-17 points), fires (-2 to -7 points), and obstacles that block movement.</p>
<p><strong>Gameplay:</strong> On your turn, select one of your available weights and choose a column to drop it into. Your raindrop falls downward and automatically collects any water it passes through (and loses water in a fire), which changes both your score and the drop's effective weight mid-fall.</p>
<p><strong>Movement Rules:</strong> At each step, the raindrop can move straight down, down-left, or down-right (obstacles block movement). The raindrop follows these priority rules:</p>
<ol>
<li><strong>Follow the water:</strong> Move to whichever adjacent cell below has the highest water value</li>
<li><strong>Break ties with straight down:</strong> If multiple cells have equally high water, choose straight down if it's one of them</li>
<li><strong>Otherwise pick a diagonal:</strong> If straight down doesn't have the highest water but both diagonals are tied, pick either diagonal</li>
<li><strong>Lightweight exception:</strong> If your drop's current weight is less than the weight which is equal in both diagonals, prioritize straight down instead</li>
</ol>
<p><strong>Winning:</strong> The game ends when all players have used all their raindrops. The player with the highest score wins.</p>
