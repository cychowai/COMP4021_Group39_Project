let gameOver = false;
let gameWin = false;

function checkGameWin() {
  if (!gameWin) {
    gameWin = checkGameWinDot();
    //time up case
    //check the remaining dots is 0 or time up
    if (gameWin) {
      gameWinSound.play();
      //wining page
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    //gameOver = isGameOver();
    //check ghost and pacman collide
    if (gameOver) {
      gameOverSound.play();
      //gameover page
    }
  }
}

function checkGameWinDot() {
  if (map.flat().filter((e) => e === 2).length === 0) {
    return true;
  }
  return false;
}
