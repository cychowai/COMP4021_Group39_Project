const Ghost = function (ctx, x, y, colour, gameArea, eatPriority) {
    const sequences = [];

    for (let i = 0; i < 4; i++) {
        sequences[i] = {
            moveLeft: { x: 84, y: 84 + i * 20, width: 20, height: 20, count: 2, timing: 50, loop: true },
            moveUp: { x: 4, y: 84 + i * 20, width: 20, height: 20, count: 2, timing: 50, loop: true },
            moveRight: { x: 124, y: 84 + i * 20, width: 20, height: 20, count: 2, timing: 50, loop: true },
            moveDown: { x: 44, y: 84 + i * 20, width: 20, height: 20, count: 2, timing: 50, loop: true }
        }
    }

    const sequencesDead = { x: 4, y: 164, width: 20, height: 20, count: 2, timing: 50, loop: true }

    /*
    const sequences = {
        moveLeftRed: { x: 84, y: 84, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveUpRed: { x: 4, y: 84, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveRightRed: { x: 124, y: 84, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveDownRed: { x: 44, y: 84, width: 20, height: 20, count: 2, timing: 50, loop: true }
    }
    */

    const sprite = Sprite(ctx, x, y);

    const setXY = function (xvalue, yvalue) {
        [x, y] = [xvalue, yvalue];
        return this;
    };

    const getRowCol = function () {
        let row = Math.floor(y / tileSize);
        let column = Math.floor(x / tileSize);
        return { row, column };

    };

    sprite.setSequence(sequences.moveLeft)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("src/images/pac_sprite.png");

    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;
    let speed = 20;
    let moveBuffer = null;

    const eaten = function () {
        sprite.setSequence(sequencesDead);

        //eatGhostSound.play();
        //console.log("ghost eaten");
    }

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
                case 1: sprite.setSequence(sequences[colour].moveLeft); break;
                case 2: sprite.setSequence(sequences[colour].moveUp); break;
                case 3: sprite.setSequence(sequences[colour].moveRight); break;
                case 4: sprite.setSequence(sequences[colour].moveDown); break;
            }
            direction = dir;

            //clear the buffer once it is succesfully moved
            if (dir === moveBuffer)
                moveBuffer = null;
        }
    };

    const update = function (time) {
        /* Update the player if the player is moving */
        if (direction !== 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 45; break;
                case 2: y -= speed / 45; break;
                case 3: x += speed / 45; break;
                case 4: y += speed / 45; break;
            }

            /* Set the new position if it is within the game area */
            if (gameArea.isPointInBox(x, y))
                sprite.setXY(x, y);


            if (isCollideWithWall(x, y, direction)) {
                direction = 0;
            }
        }

        /* Update the sprite object */
        sprite.update(time);

        if (direction !== moveBuffer)
            move(moveBuffer);
    };

    const scatter = function () {
        var exit = false;
        while (!exit) {
            var r = Math.floor(Math.random() * 3);
            if (direction === 3) {
                //var r = Math.floor(Math.random() * 3);
                let dir = 0;
                switch (r) {
                    case 0:
                        dir = 3;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 1:
                        dir = 2;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 2:
                        dir = 4;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                }
            }
            else if (direction == 1) {
                //var r = Math.floor(Math.random() * 3);
                let dir = 0;
                switch (r) {
                    case 0:
                        dir = 1;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 1:
                        dir = 2;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 2:
                        dir = 4;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                }
            }
            else if (direction == 2) {
                //var r = Math.floor(Math.random() * 3);
                let dir = 0;
                switch (r) {
                    case 0:
                        dir = 2;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 1:
                        dir = 3;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 2:
                        dir = 1;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                }
            }
            else if (direction === 4) {
                //var r = Math.floor(Math.random() * 3);
                let dir = 0;
                switch (r) {
                    case 0:
                        dir = 4;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 1:
                        dir = 3;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 2:
                        dir = 1;
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                }
            }
            else if (direction === 0) {
                var dir = Math.floor(Math.random() * 4) + 1;
                switch (dir) {
                    case 1:
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 2:
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 3:
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                    case 4:
                        if (!isCollideWithWall(x, y, dir)) {
                            move(dir);
                            exit = true;
                        }
                        break;
                }
            }
        }
    };

    const scatterOn = function () {
        setInterval(scatter, 100);
    };

    // The methods are returned as an object here.
    return {
        move: move,
        getXY: sprite.getXY,
        setXY: setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        isCollideWithWall: isCollideWithWall,
        scatterOn: scatterOn,
        getEatPriority: getEatPriority,
        eaten: eaten,
        getRowCol: getRowCol,
    };
}