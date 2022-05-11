const Player = function (ctx, x, y, gameArea, playerNum, score, order) {
    const sequences = {
        idleLeft: { x: 45, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 1, timing: 2000, loop: false },
        idleUp: { x: 45, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 1, timing: 2000, loop: false },
        idleRight: { x: 45, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 1, timing: 2000, loop: false },
        idleDown: { x: 45, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 1, timing: 2000, loop: false },

        moveLeft: { x: 143, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 2, timing: 150, loop: true },
        moveUp: { x: 335, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 2, timing: 150, loop: true },
        moveRight: { x: 237, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 2, timing: 150, loop: true },
        moveDown: { x: 45, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 2, timing: 150, loop: true },

        die: { x: 395, y: 40 + (63 * (playerNum)), width: 30, height: 30, count: 8, timing: 1000, loop: false },

    };

    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(sequences.idleDown)
        .setScale(2)
        .setPlayerScale(0.7)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("src/images/pac_man.png");

    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;
    let speed = 20;
    let moveBuffer = null;
    let dotCollected = 0;

    const getDotCollected = function () {
        return dotCollected;
    };

    let eatPriority = 1; //ghost is 2;

    // This function gets the current sprite position.
    const getXY = function () {
        return { x, y };
    };

    const setXY = function (xvalue, yvalue) {
        [x, y] = [xvalue, yvalue];
        return this;
    };

    const getRowCol = function () {
        let row = Math.floor(y / tileSize);
        let column = Math.floor(x / tileSize);
        return { row, column };
    };

    const getScore = function () {
        return score;
    };

    const getEatPriority = function () {
        return eatPriority;
    }

    const isCollideWithWall = function (x, y, dir) {
        if (dir === 0) {
            return;
        }

        let row = y / tileSize - 0.5;
        let column = x / tileSize - 0.5;
        let nextRow, nextColumn = null;
        let nextRow2, nextColumn2 = null;

        switch (direction) {
            case 0:
                nextColumn = Math.round(column);
                nextRow = Math.round(row);
                if (dir === 1) {
                    nextColumn--;
                }
                else if (dir === 2) {
                    nextRow--;
                }
                else if (dir === 3) {
                    nextColumn++;
                }
                else if (dir === 4) {
                    nextRow++;
                }
                nextRow2 = nextRow;
                nextColumn2 = nextColumn;
                break;
            case 1:
                nextColumn = Math.ceil(column);
                nextColumn2 = Math.floor(column + 0.1);
                if (dir === 2) {//from left to up
                    nextRow = row - 1;
                }
                else if (dir === 4) {//left to down
                    nextRow = row + 1;
                }
                else if (dir === 1) {//left to left
                    nextColumn--;
                    nextRow = row;
                }
                else {
                    nextRow = row;
                }
                nextRow2 = nextRow;
                break;
            case 2:
                nextRow = Math.ceil(row);
                nextRow2 = Math.floor(row + 0.1);
                if (dir === 1) {//from up to left
                    nextColumn = column - 1;
                }
                else if (dir === 3) {//up to right
                    nextColumn = column + 1;
                }
                else if (dir === 4) {//up to up
                    nextRow--;
                    nextColumn = column;
                }
                else {
                    nextColumn = column;
                }
                nextColumn2 = nextColumn;
                break;
            case 3:
                nextColumn = Math.floor(column);
                nextColumn2 = Math.ceil(column - 0.1);
                if (dir === 2) {//from right to up
                    nextRow = row - 1;
                }
                else if (dir === 4) {//right to down
                    nextRow = row + 1;
                }
                else if (dir === 3) {//right to right
                    nextColumn++;
                    nextRow = row;
                }
                else {
                    nextRow = row;
                }
                nextRow2 = nextRow;
                break;
            case 4:
                nextRow = Math.floor(row);
                nextRow2 = Math.ceil(row - 0.1);
                if (dir === 1) {//from down to left
                    nextColumn = column - 1;
                }
                else if (dir === 3) {//down to right
                    nextColumn = column + 1;
                }
                else if (dir === 4) {//down to down
                    nextRow++;
                    nextColumn = column;
                }
                else {
                    nextColumn = column;
                }
                nextColumn2 = nextColumn;
                break;
        }

        let roundedRow = Math.round(nextRow);
        let roundedColumn = Math.round(nextColumn);
        let roundedRow2 = Math.round(nextRow2);
        let roundedColumn2 = Math.round(nextColumn2);

        /*
        if (direction !== dir && direction !== 0
            && (Math.abs(column - Math.floor(column)) < 0.1 || Math.abs(column - Math.floor(column)) > 0.9)
            && (Math.abs(row - Math.floor(row)) < 0.1 || Math.abs(row - Math.floor(row)) > 0.9)) {
            moveBuffer = dir;
            return false;
        }
        */

        if (map[roundedRow][roundedColumn] === 1 || map[roundedRow2][roundedColumn2] === 1) {
            if (direction !== dir && direction !== 0)
                moveBuffer = dir;
            return true;
        }

        return false;
    };

    const move = function (dir) {
        let { x, y } = sprite.getXY();
        if (dir >= 1 && dir <= 4 && dir !== direction
            && !isCollideWithWall(x, y, dir)) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveUp); break;
                case 3: sprite.setSequence(sequences.moveRight); break;
                case 4: sprite.setSequence(sequences.moveDown); break;
            }
            direction = dir;

            //clear the buffer once it is succesfully moved
            if (dir === moveBuffer)
                moveBuffer = null;
        }
    };

    const stop = function (dir) {
        if (direction === dir) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.idleLeft); break;
                case 2: sprite.setSequence(sequences.idleUp); break;
                case 3: sprite.setSequence(sequences.idleRight); break;
                case 4: sprite.setSequence(sequences.idleDown); break;
            }
            direction = 0;
        }
    };

    // This function speeds up the player.
    const speedUp = function () {
        speed = 40; //double the speed
    };

    // This function slows down the player.
    const slowDown = function () {
        speed = 20; //back to normal speed
    };

    const eaten = function () {
        gameOverSound.play();
        console.log("player eaten");
    }

    const eatGhostPoint = function () {
        score += 500;
    }

    const eatDot = function (x, y) {
        const row = Math.floor(y / tileSize);
        const column = Math.floor(x / tileSize);
        if (map[row][column] === 2) {
            map[row][column] = 0;
            score += 50;
            return true;
        }
        return false;
    };

    const changeEatPriority = function (num) {
        eatPriority = num;
        return this;
    }

    const eatPowerDot = function (x, y) {
        const row = Math.floor(y / tileSize);
        const column = Math.floor(x / tileSize);
        if (map[row][column] === 3) {
            map[row][column] = 0;
            changeEatPriority(3);
            console.log(eatPriority);
            score += 50;
            return true;
        }
        return false;
    };

    const update = function (time, updatingPlayer) {
        /* Update the player if the player is moving */
        if (direction != 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }

            /* Set the new position if it is within the game area */
            if (gameArea.isPointInBox(x, y))
                sprite.setXY(x, y);

            //if (eatGhost(x, y) && (updatingPlayer === SignInForm.getPlayerNum()) ) {
            //
            //}

            if (eatDot(x, y) && (updatingPlayer === SignInForm.getPlayerNum())) {
                wakaSound.play();
                dotCollected++;
            }

            if (eatPowerDot(x, y) && (updatingPlayer === SignInForm.getPlayerNum())) {
                powerDotSound.play();
                console.log(eatPriority);
            }

            if (isCollideWithWall(x, y, direction)) {
                direction = 0;
            }
            /*let ghost = GamePanel.getGhost();
            for(let i = 0; i<4; i++){
                if(sprite.getBoundingBox().isPointInBox(ghost[i].getXY().x,ghost[i].getXY().y)){
                    sprite.setSequence(sequences.die);
                }
            }*/

        }

        /* Update the sprite object */
        sprite.update(time);

        if (direction !== moveBuffer)
            move(moveBuffer);
    };

    // The methods are returned as an object here.
    return {
        move: move,
        getXY: getXY,
        setXY: setXY,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        isCollideWithWall: isCollideWithWall,
        eatDot: eatDot,
        eatPowerDot: eatPowerDot,
        getScore: getScore,
        getDotCollected: getDotCollected,
        getEatPriority: getEatPriority,
        eatGhostPoint: eatGhostPoint,
        eaten: eaten,
        getRowCol: getRowCol,
        changeEatPriority: changeEatPriority,
    };
};
