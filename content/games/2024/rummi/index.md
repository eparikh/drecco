+++
title="Rummikruss"

[extra]
team="Binary Bandit"
thumbnail="thumbnail.png"
+++

<h2 id="overview">Overview</h2>
<p>In Rummikruss,  players place cards  of different colors to create
connected patterns. The goal is to maximize your score by forming sets
while blocking your opponent's moves.</p>
<h2 id="setup">Setup</h2>
<ul>
<li>Decide hyper-parameter
<ul>
<li>b := board size (5-20 squares)</li>
<li>n := number of colors (1-8)</li>
<li>c := largest number in the deck (5-16)</li>
<li>r := number of repetitions of cards with the same color.
A few randomly selected cards will be placed on the board.</li>
</ul>
</li>
</ul>
<h2 id="game-rules">Game Rules</h2>
<h3 id="basic-placement-rules">Basic Placement Rules</h3>
<ol>
<li>
<p>Players alternate turns placing cards on empty board cells.</p>
</li>
<li>
<p>Card placement must create a valid set:</p>
<ul>
<li>Ascending or descending sequence (e.g. with the same color).</li>
<li>Repeated number in different colors (e.g. blue 4, red 4, yellow 4).</li>
</ul>
</li>
<li>
<p>Placement Restrictions:</p>
<ul>
<li>Cards can only be placed in empty cells.</li>
<li>Must connect to form a valid set.</li>
<li>Last played card blocks all cards of the same color and all cards of the same number for the next player.</li>
</ul>
</li>
</ol>
<h3 id="scoring-mechanics">Scoring Mechanics</h3>
<ul>
<li>The score is updated as the length of the largest sequence made by the newly added card (see example 1 below).</li>
<li>If the placed card connects two disconnected blocks the new score is the total number of connected cards containing the placed card (see example 2 below).</li>
</ul>
<h3 id="scoring-examples">Scoring Examples</h3>
<table><thead><tr><th>Scenario</th><th>Placement</th><th>Points Earned</th></tr></thead><tbody>
<tr><td><img src="https://cs.nyu.edu/~shasha/drecco/games/2024/rummi/image.png" alt="alt text" /></td><td>Yellow 2</td><td>3 points (3 connected '2's)</td></tr>
<tr><td><img src="https://cs.nyu.edu/~shasha/drecco/games/2024/rummi/image-1.png" alt="alt text" /></td><td>Blue 6</td><td>6 points (connecting blue, red, yellow cards)</td></tr>
</tbody></table>
<h3 id="winning-the-game">Winning the Game</h3>
<ul>
<li>Game ends when:
<ul>
<li>All cards are played or,</li>
<li>no valid moves remain.</li>
</ul>
</li>
<li>Highest total score wins.</li>
</ul>
