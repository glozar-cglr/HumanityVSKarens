context = canvas.getContext('2d'),
boxSize = canvas.height/6;

let x = 0;
while (x<canvas.width) {
    x+= boxSize;
    context.fillStyle = 'rgba(146,163,179,0.2)';
    context.fillRect(x,0,boxSize,canvas.height);
    x+=boxSize
};
let y = 0;
while (y<canvas.height) {
    context.fillStyle = 'rgba(167,185,204,0.2)';
    context.fillRect(0,y,canvas.width,boxSize);
    y+= boxSize*2
};