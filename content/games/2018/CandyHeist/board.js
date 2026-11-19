class Board {

  constructor(grid) {
    this.grid = grid;
    this.gridWidth = this.grid.length;
    this.gridHeight = this.grid[0].length;
    this.empty = 1;
    this.white = '#ffffff';
    this.wall = 0;
    this.black = '#000000';
    this.blocks = []; // elements look like {x: x, y: y} where (x, y) is a wall; populated in draw()
  }

  draw() {
    for (var x = 0; x < this.gridWidth; x++) {
      for (var y = 0; y < this.gridHeight; y++) {

        // Empty square or wall?
        var color = null;
        if (this.grid[x][y] === this.empty) {
          color = this.white;
        }
        else {
          color = this.black;
          this.blocks.push({x: x, y: y});
        }

        // Draw square
        var square = document.createElementNS(svgNS, 'rect');
        square.setAttribute('x', x * squareSize + 'px');
        square.setAttribute('y', y * squareSize + 'px');
        square.setAttribute('width', squareSize + 'px');
        square.setAttribute('height', squareSize + 'px');
        square.setAttribute('stroke', this.black);
        square.setAttribute('fill', color);
        canvas.appendChild(square);

      }
    }
  }

  isValidPosition(x, y) {
    return (0 <= x && x < this.gridWidth && 0 <= y && y < this.gridHeight && this.grid[x][y] === 1);
  }

}
