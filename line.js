class Line {
    constructor(points, idx=null) {
        this.points = points;
        this.idx = idx;
    };

    /**
     * @returns Slope of this line. Return false if this is a vertical line.
     */
    slope() {
         if (this.points[1].x !== this.points[0].x)
            return (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
        else return false;
    };

    /**
     * @returns The y-intercept of this line.
     */
    yInt() {
        if (this.points[0].x === this.points[1].x) return this.points[0].x === 0 ? 0 : false;
        if (this.points[0].y === this.points[1].y) return this.points[0].y;
        return this.points[0].y - this.slope() * this.points[0].x;
    };

    /**
     * Check of the given point is on this line.
     * 
     * @param {*} p A point object that has x and y variables.
     * @returns Whether the given point in on this line.
     */
    pointOnLine(p) {
        let m = this.slope();
        if (m !== false) {
            let c = this.yInt();
            return p.y == (m * p.x + c) && (this.points[0].x <= p.x && p.x <= this.points[1].x 
                || this.points[1].x <= p.x && p.x <= this.points[0].x);
        } else {
            return p.x == this.points[0].x && (this.points[0].y <= p.y && p.y <= this.points[1].y 
                || this.points[1].y <= p.y && p.y <= this.points[0].y);
        }
    }

    // If collide with another line, raturn intersect point
    // This exclude interaction between start or end point
    // Algorithm by Paul Bourke: https://paulbourke.net/geometry/pointlineplane/
    collide(other) {
        let denom = ((other.points[1].y - other.points[0].y) * (this.points[1].x - this.points[0].x)
                    - (other.points[1].x - other.points[0].x) * (this.points[1].y - this.points[0].y));
        if (denom == 0) return false;

        let ua = ((other.points[1].x - other.points[0].x) * (this.points[0].y - other.points[0].y)
                - (other.points[1].y - other.points[0].y) * (this.points[0].x - other.points[0].x)) / denom;
        let ub = ((this.points[1].x - this.points[0].x) * (this.points[0].y - other.points[0].y)
                - (this.points[1].y - this.points[0].y) * (this.points[0].x - other.points[0].x)) / denom;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;

        let x = this.points[0].x + ua * (this.points[1].x - this.points[0].x);
        let y = this.points[0].y + ua * (this.points[1].y - this.points[0].y);

        if (x == other.points[0].x && y == other.points[0].y
            || x == other.points[1].x && y == other.points[1].y
            || x == this.points[0].x && y == this.points[0].y
            || x == this.points[1].x && y == this.points[1].y)
            return false;
        else
            return {x: x, y: y};
    };

    /**
     * @param {Line} other The other line.
     * @returns Turn if two lines are parallel and interact with each other.
     */
    overlap(other) {
        return this.slope() === other.slope() && ((this.pointOnLine(other.points[0]) 
        || this.pointOnLine(other.points[1]) || other.pointOnLine(this.points[0]) 
        || other.pointOnLine(this.points[1])));
    }

    /**
     * @returns Lenght of the line of point 0 to point 1.
     */
    length() {
        return getDistance({x: this.points[0].x, y: this.points[0].y}, {x: this.points[1].x, y: this.points[1].y});
    }

    /**
     * Create a line that start at the start point, collide with the end point, and has the given length.
     * 
     * @param {*} start A start point with x and y coordinates.
     * @param {*} end A end point with x and y coordinates.
     * @param {*} length The length of the line.
     * @returns 
     */
    static createLine(start, end, length) {
        let angle = getAngle(start, end);
        let endX = start.x + Math.sin(angle) * length;
        let endY = start.y - Math.cos(angle) * length;
        return new Line([start, {x: endX, y: endY}]);
    }

    /**
     * Create a line that start at the start point, move toward the given angle, and has the given length.
     * 
     * @param {*} start A start point with x and y coordinates.
     * @param {*} angle The angle of the line.
     * @param {*} length The length of the line.
     * @returns 
     */
    static createLineByAngle(start, angle, length) {
        let endX = start.x + Math.sin(angle) * length;
        let endY = start.y - Math.cos(angle) * length;
        return new Line([start, {x: endX, y: endY}]);
    }
}