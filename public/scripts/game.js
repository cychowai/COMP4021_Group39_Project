//sound effects - do at the end
const gameOverSound = new Audio("src/sounds/gameOver.wav");
const gameWinSound = new Audio("src/sounds/gameWin.wav");
const wakaSound = new Audio("src/sounds/waka.wav");
const powerDotSound = new Audio("src/sounds/power_dot.wav");
const eatGhostSound = new Audio("src/sounds/eat_ghost.wav");

function gameLoop() {
  createBoard(); //in map.js
  //document.getElementById("scores").value = scores;
  //checkGameOver(); //in checkGameStatus.js
  //checkGameWin(); //in checkGameStatus.js
}

setInterval(gameLoop, 10);