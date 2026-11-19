function rand(min, max, size) {
  const arr = [];
  while(arr.length < size){
    const r = Math.floor(Math.random() * (max - min + 1) ) + min;
    if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x,y];
}
