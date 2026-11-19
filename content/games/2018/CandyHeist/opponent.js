class Opponent {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#03c91d';
    this.outlineColor = '#056f13';
    this.lineElt = null;
    this.cx = this.x * squareSize + squareSize / 2;
    this.cy = this.y * squareSize + squareSize / 2;
    var dirs = [91, 135, 181, 225, 271, 315, 361, 405]; // odd so we never have to deal with tan(90 * n), and > 90
    var idx = Math.floor(Math.random() * 8);
    this.deg = dirs[idx];
  }

  draw() {

    // Draw opponent
    var opponent = document.createElementNS(svgNS, 'circle');
    opponent.setAttribute('cx', this.x * squareSize + squareSize / 2);
    opponent.setAttribute('cy', this.y * squareSize + squareSize / 2);
    opponent.setAttribute('r', squareSize / 2 - 2);
    opponent.setAttribute('fill', this.color);
    opponent.setAttribute('stroke', this.outlineColor);
    canvas.appendChild(opponent);

    // Draw opponent's drawLaser
    this.lineElt = document.createElementNS(svgNS, 'line');
    this.lineElt.setAttribute('x1', this.cx);
    this.lineElt.setAttribute('y1', this.cy);
    this.lineElt.setAttribute('x2', this.cx);
    this.lineElt.setAttribute('y2', this.cy);
    this.lineElt.setAttribute('stroke-width', '4px');
    this.lineElt.setAttribute('stroke', this.color);
    canvas.appendChild(this.lineElt);

  }

  dist(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {

      // Result contains:
      //   x = x coordinate of the intersection (treating the lines as infinite)
      //   y = y coordinate of the intersection (treating the lines as infinite)
      //   onLine1 = whether or not line segment 1 contains point
      //   onLine2 = whether or not line segment 2 contains point
      var result = {x: null, y: null, onLine1: false, onLine2: false};

      // Computations
      var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
      if (denominator == 0) {
          return result;
      }
      var a = line1StartY - line2StartY;
      var b = line1StartX - line2StartX;
      var numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
      var numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
      a = numerator1 / denominator;
      b = numerator2 / denominator;

      // Compute fields in result
      result.x = line1StartX + (a * (line1EndX - line1StartX));
      result.y = line1StartY + (a * (line1EndY - line1StartY));
      if (a > 0 && a < 1) {
          result.onLine1 = true;
      }
      if (b > 0 && b < 1) {
          result.onLine2 = true;
      }
      return result;

  };

  drawLaser(board) {

    // Track closest point
    var minDist = 1000000;
    var closestX = null;
    var closestY = null;

    // Get endpoints of laser light line
    var x1 = this.cx;
    var y1 = this.cy;
    var x2 = 1050;
    var y2 = 1050 * Math.tan(this.deg * Math.PI / 180.0);
    if ((this.deg - 90) % 360 < 180) {
      x2 = -1 * x2;
      y2 = -1 * y2;
    }

    // Check grid borders
    var borders = [[0, 0, 900, 0], [900, 0, 900, 500], [900, 500, 0, 500], [0, 500, 0, 0]];
    for (var i = 0; i < borders.length; i++) {
      var result = this.checkLineIntersection(x1, y1, x2, y2, borders[i][0], borders[i][1], borders[i][2], borders[i][3]);
      if (result.x !== null && result.y !== null && result.onLine1 && result.onLine2) {
        var thisDist = this.dist(x1, y1, result.x, result.y);
        if (thisDist < minDist) {
          minDist = thisDist;
          closestX = result.x;
          closestY = result.y;
        }
      }
    }

    // Check walls
    for (var i = 0; i < board.blocks.length; i++) {
      var x = board.blocks[i].x;
      var y = board.blocks[i].y;
      var borders = [
        [x * squareSize, y * squareSize, (x+1) * squareSize, y * squareSize],
        [(x+1) * squareSize, y * squareSize, (x+1) * squareSize, (y+1) * squareSize],
        [(x+1) * squareSize, (y+1) * squareSize, x * squareSize, (y+1) * squareSize],
        [x * squareSize, (y+1) * squareSize, x * squareSize, y * squareSize]
      ];
      for (var j = 0; j < borders.length; j++) {
        var result = this.checkLineIntersection(x1, y1, x2, y2, borders[j][0], borders[j][1], borders[j][2], borders[j][3]);
        if (result.x !== null && result.y !== null && result.onLine1 && result.onLine2) {
          var thisDist = this.dist(x1, y1, result.x, result.y);
          if (thisDist < minDist) {
            minDist = thisDist;
            closestX = result.x;
            closestY = result.y;
          }
        }
      }
    }

    // Adjust endpoint
    if (closestX !== null && closestY !== null) {
      this.lineElt.setAttribute('x2', closestX);
      this.lineElt.setAttribute('y2', closestY);
    }

  }

}
