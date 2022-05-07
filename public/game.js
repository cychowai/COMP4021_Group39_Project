function gameLoop() {
  createBoard(); //in map.js
  //checkGameOver(); //in checkGameStatus.js
  //checkGameWin(); //in checkGameStatus.js
}

setCanvasSize(canvas);
setInterval(gameLoop, 10);