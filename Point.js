class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static distance(pointA, pointB) {
        return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
    }

    add(point) {
        this.x += point.x;
        this.y += point.y;
    }

    sub(point) {
        this.x -= point.x;
        this.y -= point.y;

        return this;
    }

    mul(point) {
        this.x *= point.x;
        this.y *= point.y;
    }

    div(point) {
        this.x /= point.x;
        this.y /= point.y;
    }

    limit(max) {
        const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (magnitude > max) {
            this.x = (this.x / magnitude) * max;
            this.y = (this.y / magnitude) * max;
        }
        return this;
    }
}
