+++
title="Hilltops"

[extra]
team="Abhinav Reddy"
thumbnail="thumbnail.png"
+++

<h1 id="hilltops-game">HILLTOPS GAME</h1>
<hr />
<h3 id="game-description"><strong>GAME DESCRIPTION</strong></h3>
<p>In the hilltops problem, you are given the heights, all distinct, of a set of hilltops. The lowest hilltop contains an underground aqueduct.</p>
<p>Your goal is to create a configuration via swaps where water falling on <strong>any</strong> hilltop flows to the lowest hilltop.</p>
<h3 id="objectives"><strong>OBJECTIVES</strong></h3>
<ul>
<li><strong>Make the grid Hilltop-Perfect:</strong> All water must flow to the minimum.</li>
<li><strong>Minimize Swaps:</strong> Achieve the goal in as few moves as possible.</li>
<li><strong>Minimize Max Worst Case Distance:</strong> Reduce the longest path water takes to the bottom (Tie-breaker).</li>
</ul>
<h3 id="controls"><strong>CONTROLS</strong></h3>
<ul>
<li><strong>Drag and Drop:</strong> Click and drag tiles to swap them.</li>
<li><strong>Toggle 3D:</strong> View the topology to visualize heights.</li>
</ul>
<h3 id="understanding-the-debug-grids"><strong>UNDERSTANDING THE DEBUG GRIDS</strong></h3>
<p>When you check a solution, two helper grids appear to help you diagnose issues:</p>
<p><strong>1. Reachability Matrix</strong></p>
<ul>
<li><strong>✓ (Green):</strong> Water starting at this hilltop <em>can</em> eventually reach the lowest drain.</li>
<li><strong>X (Red):</strong> Water is trapped! It flows into a "local minimum" (a pit) that is not the main drain.</li>
</ul>
<p><strong>2. Worst Distance Matrix</strong></p>
<ul>
<li><strong>Number:</strong> The length of the <em>longest possible path</em> water takes to get from this cell to the drain.</li>
<li><strong>- (Red):</strong> The cell is not connected to the drain.</li>
<li><strong>Goal:</strong> To improve your tie-breaker score, try to minimize the largest number in this grid.</li>
</ul>
<hr />
<p>Enjoy the game!</p>
