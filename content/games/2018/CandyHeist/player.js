class Player {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#8533ff';
    this.outlineColor = '#401c75';
    this.playerElt = null;
  }

  move(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  draw() {
    this.playerElt = document.createElementNS(svgNS, 'circle');
    this.playerElt.setAttribute('cx', this.x * squareSize + squareSize / 2);
    this.playerElt.setAttribute('cy', this.y * squareSize + squareSize / 2);
    this.playerElt.setAttribute('r', squareSize / 2 - 2);
    this.playerElt.setAttribute('fill', this.color);
    this.playerElt.setAttribute('stroke', this.outlineColor);
    canvas.appendChild(this.playerElt);
  }

}
