const Player = function (ctx, x, y, gameArea) {
    const sequences = {
        idleLeft: { x: 84, y: 4, width: 20, height: 20, count: 3, timing: 2000, loop: false },
        idleUp: { x: 84, y: 44, width: 20, height: 20, count: 3, timing: 2000, loop: false },
        idleRight: { x: 84, y: 24, width: 20, height: 20, count: 3, timing: 2000, loop: false },
        idleDown: { x: 84, y: 64, width: 20, height: 20, count: 3, timing: 2000, loop: false },

        moveLeft: { x: 4, y: 4, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveUp: { x: 4, y: 44, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveRight: { x: 4, y: 24, width: 20, height: 20, count: 2, timing: 50, loop: true },
        moveDown: { x: 4, y: 64, width: 20, height: 20, count: 2, timing: 50, loop: true }
    };

    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(sequences.idleDown)
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
    const isCollideWithWall = function (x, y, dir) {
        if (dir == null) {
            return;
        }
        
        let row = y / tileSize- .5;
        let column = x / tileSize - .5;
        let nextRow, nextColumn = null;
        let nextRow2, nextColumn2 = null;

        switch (direction) {
            case 0:
                console.log("this is it");
                nextColumn = Math.round(column);
                nextRow = Math.round(row);
                if(dir == 1){
                    nextColumn--;
                }
                else if(dir == 2){
                    nextRow--;
                }
                else if(dir == 3){
                    nextColumn++;
                }
                else if(dir == 4){
                    nextRow++;
                }
                nextRow2 = nextRow;
                nextColumn2 = nextColumn;
                break;
            case 1:
                nextColumn = Math.ceil(column);
                nextColumn2 = Math.floor(column+.1);
                if(dir == 2){//from left to up
                    nextRow = row - 1;
                }
                else if(dir == 4){//left to down
                    nextRow = row + 1;
                }
                else if(dir == 1){//left to left
                    nextColumn--;
                    nextRow = row;
                }
                else{
                    nextRow = row;
                }
                nextRow2 = nextRow;
                break;
            case 2:
                nextRow = Math.ceil(row);
                nextRow2 = Math.floor(row+.1);
                if(dir == 1){//from up to left
                    nextColumn = column - 1;
                }
                else if(dir == 3){//up to right
                    nextColumn = column + 1;
                }
                else if(dir == 4){//up to up
                    nextRow--;
                    nextColumn = column;
                }
                else{
                    nextColumn = column;
                }
                nextColumn2 = nextColumn;
                break;
            case 3:         //moving right
                nextColumn = Math.floor(column);
                nextColumn2 = Math.ceil(column-.1);
                if(dir == 2){//from right to up
                    nextRow = row - 1;
                }
                else if(dir == 4){//right to down
                    nextRow = row + 1;
                }
                else if(dir == 3){//right to right
                    nextColumn++;
                    nextRow = row;
                }
                else{
                    nextRow = row;
                }
                nextRow2 = nextRow;
                break;
            case 4:
                nextRow = Math.floor(row);
                nextRow2 = Math.ceil(row-.1);
                if(dir == 1){//from down to left
                    nextColumn = column - 1;
                }
                else if(dir == 3){//down to right
                    nextColumn = column + 1;
                }
                else if(dir == 4){//down to down
                    nextRow++;
                    nextColumn = column;
                }
                else{
                    nextColumn = column;
                }
                nextColumn2 = nextColumn;
                break;
        }
        
        console.log(nextRow, nextColumn);
        let roundedRow = Math.round(nextRow);
        let roundedColumn = Math.round(nextColumn); 
        let roundedRow2 = Math.round(nextRow2);
        let roundedColumn2 = Math.round(nextColumn2); 
        if (map[roundedRow][roundedColumn] === 1 || map[roundedRow2][roundedColumn2] === 1) {
            console.log("blocked");
            if(direction != dir && direction != 0){
                moveBuffer = dir;
                console.log("this is the buffer " + moveBuffer);        
            }   
            return true;
        }
        //console.log("passed");
        return false;
    };

    const move = function (dir) {
        let { x, y } = sprite.getXY();
        if (dir >= 1 && dir <= 4 && dir != direction && !isCollideWithWall(x, y, dir)) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveUp); break;
                case 3: sprite.setSequence(sequences.moveRight); break;
                case 4: sprite.setSequence(sequences.moveDown); break;
            }
            direction = dir;

            if(dir == moveBuffer)  //clear the buffer once it is succesfully moved
                moveBuffer = null;
        }
    };

    const stop = function (dir) {
        if (direction == dir) {
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

    const eatDot = function (x, y) {
        const row = Math.floor(y / tileSize);
        const column = Math.floor(x / tileSize);
        if (map[row][column] === 2) {
            map[row][column] = 0;
            //scores += 50;
            return true;
        }
        return false;
    };

    const eatPowerDot = function (x, y) {
        const row = Math.floor(y / tileSize);
        const column = Math.floor(x / tileSize);
        if (map[row][column] === 3) {
            map[row][column] = 0;
            //scores += 100;
            return true;
        }
        return false;
    };

    const update = function (time) {
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

            if (eatDot(x, y)) {
                wakaSound.play();
            }

            if (eatPowerDot(x, y)) {
                powerDotSound.play();
            }
            if (isCollideWithWall(x, y, direction)) {
                direction = 0;
            }
        }

        /* Update the sprite object */
        sprite.update(time);
        if(direction != moveBuffer){
            move(moveBuffer);
        }

    };

    // The methods are returned as an object here.
    return {
        move: move,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        isCollideWithWall: isCollideWithWall,
        eatDot: eatDot,
        eatPowerDot: eatPowerDot,
    };
};
