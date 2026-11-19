+++
title="Morris Prime"

[extra]
team="Yue Zhang"
thumbnail="thumbnail.png"
+++

<p>Morris Prime is a variant of Nine Men's Morris. Form mills (consisting of three pieces in a row) to remove the opponent's pieces. Win by reducing the opponent to two pieces or by leaving the opponent without a legal move.</p>
<h2 id="how-to-play">How to play</h2>
<ul>
<li><strong>Pieces:</strong> 10 per player.</li>
<li><strong>Move:</strong> On a player's turn, the player can place a piece onto an empty point OR can move an existing piece to an adjacent point.</li>
<li><strong>Remove</strong> If your move forms a mill, remove one of your opponent's pieces that is not in a mill. If all your opponents pieces in a mill, you can remove any of their pieces.</li>
<li><strong>Flying:</strong> When a player has only three pieces left, then on that player's turn, they can move a single piece to any empty point.</li>
</ul>
<h2 id="diagonal-mode">Diagonal mode</h2>
<p>Toggle the <strong>Diagonals</strong> button to switch the geometry of the game.</p>
<h2 id="running-the-live-viewer">Running the live viewer</h2>
<ul>
<li>Start the relay: <code>node web.js</code> (listens on <code>127.0.0.1:10000</code>).</li>
<li>Start the server with graphics: <code>python3 morris_game.py &lt;host&gt; &lt;port&gt; 1</code>.</li>
<li>Open this game's <code>iframe.html</code> and choose <strong>Live Viewer</strong> to follow the streamed match.</li>
<li>Use <strong>Local Play</strong> to click-to-play in the browser; Diagonals can be toggled in either mode.</li>
</ul>
