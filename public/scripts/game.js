function gameLoop() {
  createBoard(); //in map.js
  //checkGameOver(); //in checkGameStatus.js
  //checkGameWin(); //in checkGameStatus.js
}

setInterval(gameLoop, 10);