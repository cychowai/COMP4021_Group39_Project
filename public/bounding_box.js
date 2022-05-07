const BoundingBox = function (ctx, top, left, bottom, right) {
    const path = new Path2D();
    path.rect(left, top, right - left, bottom - top);

    // This function gets the top side of the bounding box.
    const getTop = function () {
        return top;
    };

    // This function gets the left side of the bounding box.
    const getLeft = function () {
        return left;
    };

    // This function gets the bottom side of the bounding box.
    const getBottom = function () {
        return bottom;
    };

    // This function gets the right side of the bounding box.
    const getRight = function () {
        return right;
    };

    // This function gets the four corner points of the bounding box.
    const getPoints = function () {
        return {
            topLeft: [left, top],
            topRight: [right, top],
            bottomLeft: [left, bottom],
            bottomRight: [right, bottom],
        };
    };

    // This function tests whether a point is in the bounding box.
    // - `x`, `y` - The (x, y) position to be tested
    const isPointInBox = function (x, y) {
        return ctx.isPointInPath(path, x, y);
    };

    // This function checks whether the two bounding boxes intersect.
    // - `box` - The other bounding box
    const intersect = function (box) {
        /* Check the points of the other box */
        let points = box.getPoints();
        for (const key in points) {
            if (isPointInBox(...points[key]))
                return true;
        }

        /* Check the points of this box */
        points = getPoints();
        for (const key in points) {
            if (box.isPointInBox(...points[key]))
                return true;
        }

        return false;
    };

    // This function generates a random point inside the bounding box.
    const randomPoint = function () {
        const x = left + (Math.random() * (right - left));
        const y = top + (Math.random() * (bottom - top));
        return { x, y };
    };

    // The methods are returned as an object here.
    return {
        getTop: getTop,
        getLeft: getLeft,
        getBottom: getBottom,
        getRight: getRight,
        getPoints: getPoints,
        isPointInBox: isPointInBox,
        intersect: intersect,
        randomPoint: randomPoint
    };
};
