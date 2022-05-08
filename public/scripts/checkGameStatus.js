let gameOver = false;
let gameWin = false;

//sound effects - do at the end
//const gameOverSound = new Audio("src/sounds/gameOver.wav");
//const gameWinSound = new Audio("src/sounds/gameWin.wav");

function checkGameWin() {
  if (!gameWin) {
    //gameWin = isGameWin();
    //check the remaining dots is 0 or time up
    if (gameWin) {
      //sound
      //gameWinSound.play();
      //wining page
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    //gameOver = isGameOver();
    //check ghost and pacman collide
    if (gameOver) {
      //sound
      //gameOverSound.play();
      //gameover page
    }
  }
}