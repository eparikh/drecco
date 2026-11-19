+++
title="The City Planning Game"

[extra]
team="Kamila Zaman"
thumbnail="thumbnail.png"
+++

<p><strong>Game Explanation</strong>: This game aims to build a city in which all or most of its residents are happy. Each block represents a type of neighborhood.  The number on each block identies what type of neighborhood entity it is. For example, 1 can be residential homes, 2 can be schools, 3 can hospitals etc. 
</p><p>Now, in order to maximize happiness, the player has to make sure that they come up with a placement plan that makes sure that entities are happy with their immediate neighbours in order to have an overall happy city. In each move, the player can drag any block over another one they want to swap with.</p>
<p><strong>Game Steps:</strong></p>
<ol>
<li>Start by selecting a grid size and the number of maximum types of neighbourhoods you want to have in the city.</li>
<li>Press “Start Game”. You will see the values of each block on the city's map indicating the neighbourhood type.</li>
<li>Your objective is to make a plan to maximize your "happiness score" in the fewest swap moves. The happiness score is computed based on the following rules: Suppose k is the difference between the values of adjacent blocks. Then, if k = 0 or 2, happiness score = 0. If k = 1, then happiness score = 1. Otherwise, happiness score = -1.</li>
<li>For every block, happiness = sum of happiness scores with all neighbours. The total "happiness score" is sum of happiness scores of all blocks in the city.</li>
<li> Now, in order to make a plan, you can drag and drop one block over one another to swap positions. Each move will be counted as a swap move.</li>
<li>The final score is computed as the difference of the total happiness score of the city minus the number of swaps you did to make that plan.</li>
<li>The game preserves the specified game parameters throughout the game once start game is pressed, in order to change the grid size or the neighborhood size once start game has been pressed please use the reset button to do so and then follow the game steps described above.</li>
</ol>
