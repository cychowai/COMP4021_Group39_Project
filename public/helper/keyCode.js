let currentMovingDirection = null;
let comingMovingDirection = null;

// up: 0
// down: 1
// left: 2
// right: 3

keyCode = (event) => {
  //up
  if (event.keyCode == 38) {
    if (currentMovingDirection == 1)
      currentMovingDirection = 0;
    comingMovingDirection = 0;
  }

  //down
  if (event.keyCode == 40) {
    if (currentMovingDirection == 0)
      currentMovingDirection = 1;
    comingMovingDirection = 1;
  }

  //left
  if (event.keyCode == 37) {
    if (currentMovingDirection == 3)
      currentMovingDirection = 2;
    comingMovingDirection = 2;
  }

  //right
  if (event.keyCode == 39) {
    if (currentMovingDirection == 2)
      currentMovingDirection = 3;
    comingMovingDirection = 3;
  }

  //space - used for cheating mode
  //if (event.keyCode == 32) {}
};

