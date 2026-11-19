+++
title="Pegband"

[extra]
team="Ozzies"
thumbnail="thumbnail.png"
+++

This game is ideally played with a physical board containing peg holes, pegs of different colors, and various-length rubber bands. There are two players, we use a board with dimensions N by N and the game is played in turns. 

The game contains two phases:

- Peg Placement Phase: Each player places one peg at a time in turns.
- Rubberband Placement Phase: Each player places a rubberband by using their pegs, which are placed at the earlier phase. Players collect point based on the area that their rubberbands cover if the rubberband placement is valid, which will be explained in Rules section.

Rules:

- Peg Placement Phase: Players cannot place a peg to a location where a peg was already placed.
- Rubberband Placement Phase: Players start from one peg to place the rubberband, and select the pegs in which they want the rubberband to go from. Note that the order matters because it defines the type of area your rubberband polygon is.
- In order the rubberband placement to be valid,
— The area covered by rubberbands need to be a convex polygon,
— The area cannot contain any pegs from the other player,
— The area cannot touch pegs of other player.

Players collect points based on how many peg areas their rubberbands cover. Players can only get points from a certain area once.

How to Win: After the rubberband placement phase, the player that covers more area, eventually gets more points, wins.
