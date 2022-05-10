//0 - empty
//1 - wall
//2 - dot
//3 - power
//4 - player 1
//5 - ghost

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],  //player 1 is in this row 2nd col
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const canvas = document.getElementById("game-area");
const context = canvas.getContext("2d");
const tileSize = 20;

const wall = new Image();
wall.src = "src/images/block.png";

const dot = new Image();
dot.src = "src/images/yellowDot.png";

const power = new Image();
power.src = "src/images/cherry.png";

function setCanvasSize(canvas) {
  canvas.width = map[0].length * tileSize;
  canvas.height = map.length * tileSize;
}

/*
function didWin() {
  return this.dotLeft() === 0;
}

function dotLeft() {
  return map.flat().filter((e) => e === 0).length;
}
*/

function createBoard() {
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j] === 1) {
        context.drawImage(wall, j * tileSize, i * tileSize, tileSize, tileSize);
      }
      else if (map[i][j] === 2) {
        context.drawImage(dot, j * tileSize, i * tileSize, tileSize, tileSize);
      }
      else if (map[i][j] === 3) {
        context.drawImage(power, j * tileSize, i * tileSize, tileSize, tileSize);
      }
      else {
        context.fillStyle = "black";
        context.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      }
    }
  }
}

setCanvasSize(canvas);