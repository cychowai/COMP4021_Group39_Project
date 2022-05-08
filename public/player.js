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

    const isCollideWithWall = function (x, y, direction) {
        if (direction == null) {
            return;
        }

        const row = y / tileSize;
        const column = x / tileSize;
        let nextRow, nextColumn = 0;

        switch (direction) {
            case 1:
                nextRow = row;
                nextColumn = column - 0.5;
                break;
            case 2:
                nextRow = row - 0.5;
                nextColumn = column;
                break;
            case 3:
                nextRow = row;
                nextColumn = column + 0.5;
                break;
            case 4:
                nextRow = row + 0.5;
                nextColumn = column;
                break;
        }

        if (map[Math.floor(nextRow)][Math.floor(nextColumn)] === 1) {
            return true;
        }
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
