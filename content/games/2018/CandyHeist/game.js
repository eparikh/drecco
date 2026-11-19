////////////////////////////////////////////////////////////////////////////////
// Contents:
//   1. Game constructor
//   2. Timer functions
//   3. When player wins
//   4. Player movement
//   5. Opponent movement
//   6. Detecting collisions
//   7. Finding checkpoints
////////////////////////////////////////////////////////////////////////////////

class Game {

  //////////////////////////////////////////////////////////////////////////////
  // GAME CONSTRUCTOR
  //////////////////////////////////////////////////////////////////////////////

  constructor(grid, t, c, p, o, speedSelected) {

    // Board
    this.board = new Board(grid);
    this.board.draw();

    // Target
    this.target = new Target(t.x, t.y);
    this.target.draw();

    // Checkpoints
    this.checkpoints = [];
    for (var i = 0; i < c.length; i++) {
      var check = new Checkpoint(c[i].x, c[i].y);
      this.checkpoints.push(check);
      check.draw();
    }

    // Player
    this.player = new Player(p.x, p.y);
    this.player.draw();

    // Opponents
    this.opponents = [];
    for (var i = 0; i < o.length; i++) {
      var opp = new Opponent(o[i].x, o[i].y);
      this.opponents.push(opp);
      opp.draw();
    }

    // Opponents' lasers
    this.laserSpeed = 0;
    switch(speedSelected) {
      case 'slow':
        this.laserSpeed = 55;
        break;
      case 'medium':
        this.laserSpeed = 40;
        break;
      case 'fast':
        this.laserSpeed = 25;
        break;
      default: // null, nothing selected
        this.laserSpeed = 40;
        break;
    }

    this.intervalID1 = setInterval(
      (function(self) {
        return function() {
          self.tellOpponentsToMove();
        }
      })(this),
      this.laserSpeed
    );

    // Timing
    this.gameInProgress = false;
    this.startTime = new Date();
    this.intervalID2 = setInterval(
      (function(self) {
        return function() {
          self.showTime();
        }
      })(this),
      1000
    );

  }

  //////////////////////////////////////////////////////////////////////////////
  // TIMER FUNCTIONS
  //////////////////////////////////////////////////////////////////////////////

  // Update timer during game play
  showTime() {

    // Don't update display if game is not in progress
    if (!this.gameInProgress) {
      return;
    }

    // Get start/current seconds and minutes
    var curTime = new Date();

    // Find difference between start and current
    var timeDiff = Math.abs(curTime.getTime() - this.startTime.getTime());
    var diffMins = Math.floor(timeDiff / (1000 * 60));
    var diffSecs = Math.floor((timeDiff / 1000) % 60);

    // Put string together (with padded zeros if necessary)
    diffMins = ('0' + diffMins).slice(-2);
    diffSecs = ('0' + diffSecs).slice(-2);
    var str = diffMins + ':' + diffSecs;
    timeDisplay.innerHTML = str;

  }

  //////////////////////////////////////////////////////////////////////////////
  // WHEN PLAYER WINS
  //////////////////////////////////////////////////////////////////////////////

  // When player wins, stop timer (which stops game play)
  won() {
    window.removeEventListener('keydown', keyListener, false);
    this.gameInProgress = false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // PLAYER MOVEMENT
  //////////////////////////////////////////////////////////////////////////////

  // Have arrow keys trigger player movement
  handleArrowKeyPress(whichKey) {
    if (whichKey === 37 && this.board.isValidPosition(this.player.x - 1, this.player.y)) {
      this.tellPlayerToMove(this.player.x - 1, this.player.y);
    }
    if (whichKey === 38 && this.board.isValidPosition(this.player.x, this.player.y - 1)) {
      this.tellPlayerToMove(this.player.x, this.player.y - 1);
    }
    if (whichKey === 39 && this.board.isValidPosition(this.player.x + 1, this.player.y)) {
      this.tellPlayerToMove(this.player.x + 1, this.player.y);
    }
    if (whichKey === 40 && this.board.isValidPosition(this.player.x, this.player.y + 1)) {
      this.tellPlayerToMove(this.player.x, this.player.y + 1);
    }
  }

  // Handle player movement
  tellPlayerToMove(newX, newY) {

    // Do nothing if invalid space
    if (!this.board.isValidPosition(newX, newY)) {
      return;
    }

    // Move player
    this.player.move(newX, newY);
    this.player.playerElt.setAttribute('cx', newX * squareSize + squareSize / 2);
    this.player.playerElt.setAttribute('cy', newY * squareSize + squareSize / 2);

    // Check if player has now reached target
    if (this.player.x === this.target.x && this.player.y === this.target.y) {
      this.won();
    }
    // Check if player has hit opponent/laser light; if so move player
    else if (this.playerHitOppOrLaser()) {
      var closestCheck = this.closestCheckpoint();
      this.player.move(closestCheck.x, closestCheck.y);
      this.player.playerElt.setAttribute('cx', closestCheck.x * squareSize + squareSize / 2);
      this.player.playerElt.setAttribute('cy', closestCheck.y * squareSize + squareSize / 2);
    }

  }

  //////////////////////////////////////////////////////////////////////////////
  // OPPONENT MOVEMENT
  //////////////////////////////////////////////////////////////////////////////

  // Handle opponent movement
  tellOpponentsToMove() {

    // Don't move opponent if game is not in progress
    if (!this.gameInProgress) {
      return;
    }

    for (var i = 0; i < this.opponents.length; i++) {

      // Rotate laser light
      this.opponents[i].deg += 2;
      this.opponents[i].drawLaser(this.board);

      // Get endpoints of laser light: (x1, y1) and (x2, y2)
      var x1 = parseInt(this.opponents[i].lineElt.getAttribute('x1'));
      var y1 = parseInt(this.opponents[i].lineElt.getAttribute('y1'));
      var x2 = parseInt(this.opponents[i].lineElt.getAttribute('x2'));
      var y2 = parseInt(this.opponents[i].lineElt.getAttribute('y2'));

      // Get player's circle outline
      var cx = this.player.x * squareSize + squareSize / 2;
      var cy = this.player.y * squareSize + squareSize / 2;
      var r = squareSize / 2; // use radius = 10 so far away lasers don't skip over player

      // Check if player has hit opponent
      if (this.player.x === this.opponents[i].x && this.player.y === this.opponents[i].y) {
        var closestCheck = this.closestCheckpoint();
        this.tellPlayerToMove(closestCheck.x, closestCheck.y);
      }
      // Check if player has hit laser light
      else if (this.lineCircle(x1, y1, x2, y2, cx, cy, r)) {
        var closestCheck = this.closestCheckpoint();
        this.tellPlayerToMove(closestCheck.x, closestCheck.y);
      }

    }

  }

  //////////////////////////////////////////////////////////////////////////////
  // DETECTING COLLISIONS
  //////////////////////////////////////////////////////////////////////////////

  // Returns true if player's current position overlaps any opponent or laser, returns false otherwise
  playerHitOppOrLaser() {

    for (var i = 0; i < this.opponents.length; i++) {

      // Get endpoints of laser light: (x1, y1) and (x2, y2)
      var x1 = parseInt(this.opponents[i].lineElt.getAttribute('x1'));
      var y1 = parseInt(this.opponents[i].lineElt.getAttribute('y1'));
      var x2 = parseInt(this.opponents[i].lineElt.getAttribute('x2'));
      var y2 = parseInt(this.opponents[i].lineElt.getAttribute('y2'));

      // Get player's circle outline
      var cx = this.player.x * squareSize + squareSize / 2;
      var cy = this.player.y * squareSize + squareSize / 2;
      var r = squareSize / 2;

      // Check if player has hit opponent
      if (this.player.x === this.opponents[i].x && this.player.y === this.opponents[i].y) {
        return true;
      }
      // Check if player has hit laser light
      else if (this.lineCircle(x1, y1, x2, y2, cx, cy, r)) {
        return true;
      }

    }

    return false;

  }

  // Return distance from (x1, y1) to (x2, y2)
  dist(x1, y1, x2, y2) {
    var distX = x2 - x1;
    var distY = y2 - y1;
    return Math.sqrt(distX * distX + distY * distY);
  }

  // Return true if point is on circle border or inside circle
  pointCircle(px, py, cx, cy, r) {

    // Get distance between the point and circle's center
    var distance = this.dist(px, py, cx, cy);

    // If the distance is less than the circle's radius the point is inside
    if (distance <= r) {
      return true;
    }
    return false;

  }

  // Return true if point is on line
  linePoint(x1, y1, x2, y2, px, py) {

    // Get distance from the point to the two ends of the line
    var d1 = this.dist(px, py, x1, y1);
    var d2 = this.dist(px, py, x2, y2);

    // Get the length of the line
    var lineLen = this.dist(x1, y1, x2, y2);

    // Float buffer zone: higher # = less accurate
    var buffer = 0.05;

    // If the two distances are equal to the line's length, the point is on the line
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;

  }

  // Return true if line intersects circle
  lineCircle(x1, y1, x2, y2, cx, cy, r) {

    // Check if either endpoint is inside the circle
    var inside1 = this.pointCircle(x1, y1, cx, cy, r);
    var inside2 = this.pointCircle(x2, y2, cx, cy, r);
    if (inside1 || inside2) {
      return true;
    }

    // Get length of the line
    var len = this.dist(x1, y1, x2, y2);

    // Get dot product of the line and circle
    var dot = ( ((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1)) ) / (len * len);

    // Find the closest point on the line
    var closestX = x1 + (dot * (x2 - x1));
    var closestY = y1 + (dot * (y2 - y1));

    // Check if is this point actually on the line segment
    var onSegment = this.linePoint(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) {
      return false;
    }

    // Get distance to closest point
    var distance = this.dist(cx, cy, closestX, closestY);
    if (distance <= r) {
      return true;
    }
    return false;

  }

  //////////////////////////////////////////////////////////////////////////////
  // FINDING CHECKPOINTS
  //////////////////////////////////////////////////////////////////////////////

  // Returns true if (x, y) is in board bounds, returns false otherwise
  inBoardBounds(x, y) {
    return x >= 0 && x < this.board.gridWidth && y >= 0 && y < this.board.gridHeight;
  }

  // Fill and return copy of gameboard with "gameboard distance" measurements
  minDistanceBoard() {

    // Fill minDistBoard with empty as maxInt, wall as -1
    var minDistBoard = new Array(this.board.gridWidth).fill(0).map(() => new Array(this.board.gridHeight).fill(0));
    const maxInt = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < this.board.gridWidth; i++) {
      for (var j = 0; j < this.board.gridHeight; j++) {
        if (this.board.grid[i][j] === this.board.empty) {
          minDistBoard[i][j] = maxInt;
        }
        else {
          minDistBoard[i][j] = -1;
        }
      }
    }

    // BFS to fill the min  distance from player location to each spot on the board_size
    var queue = [[this.player.x, this.player.y]];
    minDistBoard[this.player.x][this.player.y] = 0;
    while (queue.length > 0) {
      var [x,y] = queue.pop();
      var neighbors = [[x+1,y],[x-1,y],[x, y+1],[x,y-1]];
      for (var i = 0; i < neighbors.length; i++) {
        var xn = neighbors[i][0];
        var yn = neighbors[i][1];
        if (this.inBoardBounds(xn, yn) && minDistBoard[xn][yn] === maxInt){
          minDistBoard[xn][yn] = Math.min(minDistBoard[xn][yn], minDistBoard[x][y] + 1)
          queue.unshift([xn,yn]);
        }
      }
    }
    return minDistBoard;

  }

  // Returns the closest checkpoint cp = {x: val, y: val}
  closestCheckpoint() {
    var minDist = Number.MAX_SAFE_INTEGER;
    var minCP = {x: 0, y: 0};
    var minDistBoard = this.minDistanceBoard();
    for (var i = 0; i < this.checkpoints.length; i++) {
      var cp = this.checkpoints[i];
      if (minDistBoard[cp.x][cp.y] < minDist) {
        minDist = minDistBoard[cp.x][cp.y];
        minCP = {x: cp.x, y: cp.y};
      }
    }
    return minCP;
  }

  // Returns index of checkpoint at (x, y) (with respsect to this.checkpoints array)
  indexOfCheckpoint(x, y) {
    for (var i = 0; i < this.checkpoints.length; i++) {
      if (x === this.checkpoints[i].x && y === this.checkpoints[i].y) {
        return i;
      }
    }
    return -1;
  }

}
