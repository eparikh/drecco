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
        <h1 id="gameName">Quoridor</h1>
        <h3 id="groupName">Team Z</h3>
        <h3>Instruction:</h3>
        <div id="gameDesc" class="jumbotron">
            <strong>Overview:</strong> <br/>
            <p> Quoridor is played on a game board of (M X N) square spaces.
                Each player is represented by a pawn which begins at the center space of one edge of the board.
                The objective is to be the first player to move their pawn to any space on the opposite side of the game board from which it begins.
            </p>
            <strong>Walls:</strong> <br/>
            <p>
                Each player starts with K walls. Walls are flat two-space-wide pieces which can be placed in the groove that runs between the spaces. 
                Walls block the path of all pawns, which must go around them. 
                The walls are divided equally among the players at the start of the game, and once placed, cannot be moved or removed. 
                On a turn, a player may either move their pawn, or, if possible, place a wall.
                Walls can be placed directly between two spaces, in any groove not already occupied by a wall. However, a wall may not be placed which cuts off the only remaining path of any pawn to the side of the board it must reach.
            </p>
            <strong>Movement</strong> <br/>
            <p>
                Pawns can be moved to any space at a right angle (but not diagonally). 
                If adjacent to another pawn, the pawn may jump over that pawn. </p>
            <img src="games/Quoridor/img/jump1.png"/>
            <p>blue pawn can jump over red pawn</p><br/>

            <p> If an adjacent pawn has a wall on the other side of it, the player may move to either space that is immediately adjacent (left or right) to the first pawn. 
                Walls may not be jumped, including when moving laterally due to a wall being behind a jumped pawn.
            </p>
            <img src="games/Quoridor/img/jump2.png"/>
            <p>red pawn can not jump over blue pawn because there is a wall, but red pawn can jump to the left or right to the blue pawn.</p><br/>
            <p>The first player to move their pawn to any space on the opposite side of the game board from which it begins win the game </p>
        </div>
        <h3>Settings</h3>
        <form id="gameSettings" class="well">
            <h3> If you want to play in a separate window, press popup </h3>
        </form>
        <iframe src="games/Quoridor/index.html" class="game" width="900" height="1200"></iframe>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(800,800,"games/Quoridor/index.html", ['textBoxDemo', 'btnDemo', 'selectDemo']);
</script>
</body>
</html>
