class Target {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colors = ['#8C0000', '#B20000', '#D90000', '#ff0000', '#FF7373'];
  }

  draw() {
    for (var i = 0; i < this.colors.length; i++) {
      var target = document.createElementNS(svgNS, 'circle');
      target.setAttribute('cx', this.x * squareSize + squareSize / 2 + 'px');
      target.setAttribute('cy', this.y * squareSize + squareSize / 2 + 'px');
      target.setAttribute('r', squareSize / 2 - 1 - 2 * i + 'px');
      target.setAttribute('fill', 'white');
      target.setAttribute('stroke', this.colors[i]);
      canvas.appendChild(target);
    }
  }
}
