class Checkpoint {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#f5d030';
    this.outlineColor = '#000000';
  }

  draw() {
    var diamond = document.createElementNS(svgNS, 'rect');
    diamond.setAttribute('x', this.x * squareSize + squareSize / 6 + 'px');
    diamond.setAttribute('y', this.y * squareSize + squareSize / 6 + 'px');
    diamond.setAttribute('width', squareSize / 1.5 + 'px');
    diamond.setAttribute('height', squareSize / 1.5 + 'px');
    diamond.setAttribute('stroke', this.outlineColor);
    diamond.setAttribute('fill', this.color);
    var cx = this.x * squareSize + squareSize / 2;
    var cy = this.y * squareSize + squareSize / 2;
    diamond.setAttribute('transform-origin', cx + 'px ' + cy + 'px');
    diamond.setAttribute('transform', 'rotate(45)');
    canvas.appendChild(diamond);
  }

}
