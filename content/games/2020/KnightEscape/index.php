<!-- We'd like to acknowledge the Arcitects of Dig That from Dr Ecco website, Team WA, whose code served as the base upon which we build out game -->
<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
    <base href="../../">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <script src="js/gameSettings.js"></script>
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
        <h1 id="gameName">Knight Escape</h1>
        <h3 id="groupName">Team AgNation</h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
        <strong>Overview:</strong> <br/>
            <p> 
                Attention! <br/><br/> A city-wide alert has been raised as the notorious team of con artists, AgNation, has managed to do it yet again. They have in their possession the prized KITKAT which they've stolen from the beloved Dr Ecco. 
                A high-tension chase has ensued as they make their way out of NYC. NYC has deployed teams of detectives to chase them down. AgNation has to escape them or they will face perilious consequences. <br/><br/>

                The choice is yours. Help AgNation escape and get a share of the KITKAT or help Dr Ecco capture the thieves. 
            </p>
            <strong>Rules:</strong> <br/>
            The player can pick the number of detectives. 
            The detectives pick their positions on the board first after which the escapee team can strategically position itself.
            <ul>
                <li> Escapee: <br/>
                Objective: Get from the start row to the end row within 32 moves without ever occupying the same location as a detective. 
                    <ol> 
                        <li>At the beginning of the game, you get to choose your position on the start row.</li>   
                        <li>At every turn you can move to the horizontally and vertically adjacent nodes to your current position.</li>
                        <li>Once every 3 moves, you get to move like a knight from chess, that is move in a L shape with respect to your current position.</li>
                    </ol>

                </li>
                <li> Detectives: <br/>
                Objective: Capture the escapee either by occupying the same location as them or not allowing them to reach the end row before 32 moves have elapsed. 
                    <ol>    
                        <li>At the beginning, you get to place your detectives (2,3,4 or 5) on rows 5-8 from the bottom.</li>
                        <li>At every turn, you can move one of your detectives to horizontally and vertically adjacent nodes of their current position.</li>
                    </ol>
                </li>
            </ul>
            </ul>
            Once a game finishes a new game automatically starts with the parameters that you selected initially.<br/><br/>

            We'd like to thank the students who came before us, Team WA, for the grid structure and game setup code that we adopted for our game. 
        </div>
        <h3>Leaderboard:</h3>
    <div id="scoreArea", class="jumbotron">
	<?php
	    include $base."getScore.php";
	    /*
	    * arg1: gameName, should be the same as the dir name
	    * arg2: if your score is sortable, pass 1 if higher score is better, 0
	    *       if smaller score is better. Otherwise no need to pass variable
	    */
	    getScore("KnightEscape", 0);
	?>
	</div>
        <h3>Play It!</h3>
        <form id="gameSettings" class="well">
            <h3> If you want to play in a separate window, press popup </h3>
        </form>
        <iframe src="games/KnightEscape/iframe.html" class="game" width="900" height="1200"></iframe>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(800,800,"games/KnightEscape/iframe.html", ['textBoxDemo', 'btnDemo', 'selectDemo']);
</script>
</body>
</html>
