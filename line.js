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
     * Get the points of intersection between a line and a rotated ellipse.
     * Equation of ellipse: ((x-h)cos(angle)+(y-k)sin(angle))^2 / xr^2 + ((x-h)sin(angle)-(y-k)cos(angle))^2 / yr^2 = 1
     * Equation of line: y = mx+c
     * where m is slope and c is y-intercept
     * 
     * @param {number} xr The radius of ellipse along x-axis.
     * @param {number} yr The radius of ellipse along y-axis.
     * @param {number} h The x-coordinate of tehe center point of the ellipse.
     * @param {number} k The y-coordinate of tehe center point of the ellipse.
     * @param {number} angle The angle of rotation. Positive angle means rotating counter-clockwise.
     */
    collideRotatedEllipse(xr, yr, h, k, angle) {
        let m = this.slope();
        let c = this.yInt();

        let cosa = Math.cos(angle) * Math.cos(angle) / (xr * xr);
        let cosb = Math.cos(angle) * Math.cos(angle) / (yr * yr);
        let sina = Math.sin(angle) * Math.sin(angle) / (xr * xr);
        let sinb = Math.sin(angle) * Math.sin(angle) / (yr * yr);
        let sincosab = (Math.sin(angle) * Math.cos(angle) / (xr * xr)) - (Math.sin(angle) * Math.cos(angle) / (yr * yr));

        let A = cosa + sinb + m * m * (sina + cosb) + 2 * m * sincosab;

        let B = 0;
        if (m == 0) B = 2 * (c - k) * sincosab;
        else B = 2 * (-h * (cosa + sinb) + m * (c - k) * (sina + cosb) + (c - k) * sincosab);

        let C = 0;
        if (m == 0) C = (c - k) * (c - k) * (sina + cosb) - 1;
        else C = h * h * (cosa + sinb) + (c - k) * (c - k) * (sina + cosb) + 2 * h * (c - k) * sincosab - 1;

        let denom = B * B - 4 * A * C;
        if (denom < 0) return [];

        let result = [];
        let x = (-B + Math.sqrt(denom)) / (2 * A);
        let y = m * x + c;
        result.push({x: x, y: y});
        x = (-B - Math.sqrt(denom)) / (2 * A);
        y = m * x + c;
        result.push({x: x, y: y});

        return result;
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