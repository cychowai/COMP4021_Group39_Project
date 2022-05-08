const Sprite = function (ctx, x, y) {
    const sheet = new Image();
    let sequence = { x: 0, y: 0, width: 20, height: 20, count: 1, timing: 0, loop: false };
    let index = 0;
    let scale = 1;
    let shadowScale = { x: 1, y: 0.25 };
    let lastUpdate = 0;

    const useSheet = function (spriteSheet) {
        sheet.src = spriteSheet;
        return this;
    };

    // This function returns the readiness of the sprite sheet image.
    const isReady = function () {
        return sheet.complete && sheet.naturalHeight != 0;
    };

    // This function gets the current sprite position.
    const getXY = function () {
        return { x, y };
    };

    const setXY = function (xvalue, yvalue) {
        [x, y] = [xvalue, yvalue];
        return this;
    };

    const setSequence = function (newSequence) {
        sequence = newSequence;
        index = 0;
        lastUpdate = 0;
        return this;
    };

    const setScale = function (value) {
        scale = value;
        return this;
    };

    const setShadowScale = function (value) {
        shadowScale = value;
        return this;
    };

    // This function gets the display size of the sprite.
    const getDisplaySize = function () {
        /* Find the scaled width and height of the sprite */
        const scaledWidth = sequence.width * scale * 0.4;
        const scaledHeight = sequence.height * scale * .4;
        return { width: scaledWidth, height: scaledHeight };
    };

    // This function gets the bounding box of the sprite.
    const getBoundingBox = function () {
        /* Get the display size of the sprite */
        const size = getDisplaySize();

        /* Find the box coordinates */
        const top = y - size.height / 2;
        const left = x - size.width / 2;
        const bottom = y + size.height / 2;
        const right = x + size.width / 2;

        return BoundingBox(ctx, top, left, bottom, right);
    };

    // This function draws the sprite.
    const drawSprite = function () {
        /* Save the settings */
        ctx.save();

        /* Get the display size of the sprite */
        const size = getDisplaySize();

        ctx.drawImage(
            sheet,
            sequence.x +
            index * sequence.width,
            sequence.y,
            sequence.width, sequence.height,
            parseInt(x - size.width / 2), parseInt(y - size.height / 2),
            size.width, size.height
        );

        /* Restore saved settings */
        ctx.restore();
    };

    // This function draws the shadow and the sprite.
    const draw = function () {
        if (isReady()) {
            drawSprite();
        }
        return this;
    };

    const update = function (time) {
        if (lastUpdate == 0) lastUpdate = time;

        if (time - lastUpdate >= sequence.timing) {
            index++;
            lastUpdate = time;
            if (index >= sequence.count && sequence.loop == true)
                index = 0;
            else if (index >= sequence.count && sequence.loop == false)
                index--;
        }
        return this;
    };

    // The methods are returned as an object here.
    return {
        useSheet: useSheet,
        getXY: getXY,
        setXY: setXY,
        setSequence: setSequence,
        setScale: setScale,
        setShadowScale: setShadowScale,
        getDisplaySize: getDisplaySize,
        getBoundingBox: getBoundingBox,
        isReady: isReady,
        draw: draw,
        update: update,
    };
};
