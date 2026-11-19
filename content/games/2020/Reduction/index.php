<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
    <base href="../../">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <link rel="stylesheet" type="text/css" href="css/facebox.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('a[rel*=facebox]').facebox()
        })
    </script>
</head>
<body>
  <div class="container">
    <?php include $base."header.php"; ?>
    <nav>
      <ul>
      <li><a href="">Home</a></li>
      </ul>
      <?php include $base."leftMenuGame.php"; ?>
    </nav>
    <article>
      <h1 id="gameName">Reduction</h1>
      <h3 id="groupName">Team '; DROP TABLE teams;</h3>
      <button
        style="background-color: blue; color: white; width: 200px; height: 60px; border-radius: 10px; padding: 0; border: none;"
        onclick="document.getElementById('gameDesc').style.display = (document.getElementById('gameDesc').style.display === '') ? 'none' : ''">
        Hide/show rules
      </button>
      <div id="gameDesc" class="jumbotron">
        <h3>Rules:</h3>
        <br/>
        <span>Basic gameplay: Reduction is played on a square board of some size which the players can choose (side length between 10 and 20). Each space of this board is either empty or full; the board starts out with each space randomly empty or full. In Reduction, players make changes to the board. There are three types of change; each of these types affects only a 2x2 region of the board and can be done by clicking near the center intersection of that 2x2 region. If you can make a change on a 2x2 region, that region's center intersection will be green; otherwise, its center intersection will be red.</span>
        <ol>
          <li>
            Take an entirely empty 2x2 region and make it entirely full.
            <br/>
            <img src="games/reduction/board1.png" alt="Empty 2x2 region"/> <span style="vertical-align: middle; font-size: 5rem; position: relative; bottom: 5px;">&#8594;</span> <img src="games/reduction/board2.png" alt="Full 2x2 region"/>
          </li>
          <li>
            Take an entirely full 2x2 region and make it entirely empty.
            <br/>
            <img src="games/reduction/board2.png" alt="Full 2x2 region"/> <span style="vertical-align: middle; font-size: 5rem; position: relative; bottom: 5px;">&#8594;</span> <img src="games/reduction/board1.png" alt="Empty 2x2 region"/>
          </li>
          <li>
            Take a 2x2 region with only two spaces filled and with those two spaces separated by a diagonal (rather than one being directly above or to the left of the other), and to flip all the spaces in that 2x2 region, resulting in that region still having two diagonally separared full spaces but with those spaces being the other two spaces in the region.
            <br/>
            <img src="games/reduction/board3.png" alt="Diagonal 2x2 region"/> <span style="vertical-align: middle; font-size: 5rem; position: relative; bottom: 5px;">&#8596;</span> <img src="games/reduction/board4.png" alt="Other diagonal 2x2 region"/>
          </li>
        </ol>
        <span>On a turn, a player can make up to some number of changes to the board. Like the board size, this number of changes is chosen by the players at the start of the game (at least 5, no upper bound). The goal of each player on their turn is to reduce the number of full spaces from its value at the start of their turn. As soon as they do this, their turn ends. However, if they make the maximum allowed number of changes per turn without reducing the number of full spaces, the game ends and they lose (the other player wins).</span>
      </div>
      <h3>Leaderboard:</h3>
    	<div id="scoreArea" class="jumbotron">
      	<?php 
      	    include $base."getScore.php";
      	    /*
      	    * arg1: gameName, should be the same as the dir name 
      	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
      	    *       if smaller score is better. Otherwise no need to pass variable
      	    */
      	    getScore("Reduction");
      	?>
    	</div>
      <div>
        <h3>Settings</h3>
        <a target="_blank" href="games/reduction/iframe.html">Open the game in a new window/tab</button>
        <br/>
        <iframe src="games/reduction/iframe.html" class="game" width="900" height="900"></iframe>
      </div>
      <?php include $base."footer.php"; ?>
    </article>
  </div>
</body>
</html>
