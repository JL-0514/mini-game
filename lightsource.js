class LightSource {
    /**
     * 
     * @param {GameEngine} game The game engine
     * @param {number} x The x-coordinate of this light source.
     * @param {number} y The y-coordinate of this light source.
     * @param {number} radius The radius of the light source.
     */
    constructor(game, x, y, radius) {
        Object.assign(this, { game, x, y, radius });
        this.lines = [];
        this.walls = [];
        this.arc = [];
        this.BB = new CircularBB(this.x, this.y, this.radius);
    }

    /**
     * Add lines that represent walls that block the light.
     * The walls are retangular.
     * 
     * @param {Wall} wall The wall that block the light.
     */
    addWall(wall) {
        // Four edges of the wall
        // ul=upper-left, ur=upper-right, ll=lower-left, lr=lower-right
        let ul = {x: wall.BB.x, y: wall.BB.y};
        let ur = {x: wall.BB.x + wall.BB.width, y: wall.BB.y};
        let ll = {x: wall.BB.x, y: wall.BB.y + wall.BB.height};
        let lr = {x: wall.BB.x + wall.BB.width, y: wall.BB.y + wall.BB.height};

        // Check for distance from the edges. 
        // If out of radius of light source, reduce the endpoint of light to farther possible point.
        let tp = {x: this.x, y:this.y};
        if (getDistance(ul, tp) <= this.radius || getDistance(ur, tp) <= this.radius
            || getDistance(ll, tp) <= this.radius || getDistance(lr, tp) <= this.radius) {
            // Only the top side of horizontal wall can block the light
            if ((wall instanceof HorizontalWall || wall instanceof BreakableHorizontalWall) 
                && getRightSide(this.radius, wall.BB.y - this.y)) {
                if (getDistance(ul, {x: this.x, y: this.y}) > this.radius) 
                    ul.x = this.x - getRightSide(this.radius, wall.BB.y - this.y);
                if (getDistance(ur, {x: this.x, y: this.y}) > this.radius)
                    ur.x = this.x + getRightSide(this.radius, wall.BB.y - this.y);
                this.walls.push(new Line([ul, ur]));
                this.lines.push(new Line([{x: this.x, y: this.y}, ul]));
                this.lines.push(new Line([{x: this.x, y: this.y}, ur]));
            }

            // Only the left and right side of vertical wall can block the light
            if (this.x < wall.BB.x 
                && (wall instanceof VerticalWall || wall instanceof BreakableVerticalWall)) {
                if (getDistance(ul, {x: this.x, y: this.y}) > this.radius) 
                    ul.y = this.y - getRightSide(this.radius, wall.BB.x - this.x);
                if (getDistance(ll, {x: this.x, y: this.y}) > this.radius)
                    ll.y = this.y + getRightSide(this.radius, wall.BB.x - this.x);
                this.walls.push(new Line([ul, ll]));
                this.lines.push(new Line([{x: this.x, y: this.y}, ul]));
                this.lines.push(new Line([{x: this.x, y: this.y}, ll]));
            }
            else if (this.x > wall.BB.x + wall.BB.width  
                && (wall instanceof VerticalWall || wall instanceof BreakableVerticalWall)) {
                if (getDistance(ur, {x: this.x, y: this.y}) > this.radius) 
                    ur.y = this.y - getRightSide(this.radius, wall.BB.x + wall.BB.width - this.x);
                if (getDistance(lr, {x: this.x, y: this.y}) > this.radius)
                    lr.y = this.y + getRightSide(this.radius, wall.BB.x + wall.BB.width - this.x);
                this.walls.push(new Line([ur, lr]));
                this.lines.push(new Line([{x: this.x, y: this.y}, ur]));
                this.lines.push(new Line([{x: this.x, y: this.y}, lr]));
            }
        }
    }

    /**
     * Add lines that represent light. Link the light source to all points that make up walls.
     * If light intersect with wall, remove it.
     * Sort the light based on its angle from the light source so it can be draw correctly.
     */
    checkLine() {
        // Connect points from the wall to light source
        for (let i = 0; i < this.walls.length - 1; i++) {
            for (let j = i + 1; j < this.walls.length; j++) {
                let intersect = this.walls[i].collide(this.walls[j]);
                if (intersect) this.lines.push(new Line([{x: this.x, y: this.y}, intersect]));
            }
        }
        // Remove light that intersect with wall
        for (let j = 0; j < this.walls.length; j++) {
            for (let i = this.lines.length - 1; i >= 0; --i) {
                let intersect = this.lines[i].collide(this.walls[j]);
                if (intersect) this.lines.splice(i, 1);
            }
        }
        // Remove duplicated light
        this.lines = this.lines.reduce((unique, o) => {
            if(!unique.some(line => line.points[0].x === o.points[0].x && line.points[0].y === o.points[0].y 
                && line.points[1].x === o.points[1].x && line.points[1].y === o.points[1].y)) {
              unique.push(o);
            }
            return unique;
        },[]);
        // Sort lines
        this.lines.sort((a, b) => {
            return getAngle(a.points[0], a.points[1]) - getAngle(b.points[0], b.points[1]);
        });
    }

    /**
     * Create arc of light that's not blocked by the wall.
     */
    createArc() {
        for (let i = 0; i < this.lines.length; i++) {
            let p1 = this.lines[i].points[1];
            let p2 = this.lines[(i + 1) % this.lines.length].points[1];
            let temp = new Line([p1, p2]);
 
            for (let j = 0; j < this.walls.length && temp; j++) {
                let w = this.walls[j];
                if (temp.slope() === w.slope() 
                    && (w.pointOnLine(temp.points[0]) || w.pointOnLine(temp.points[1]) 
                    || temp.pointOnLine(w.points[0]) || temp.pointOnLine(w.points[1]))) 
                    temp = false;
            }

            if (temp) {
                let tp = {x: this.x, y: this.y};
                this.arc.push({x: this.x, y: this.y, r: this.radius, sa: getAngle(tp, p1), ea: getAngle(tp, p2)});
            }
        }
    }

    fillLight(ctx) {
        // for (let i = 0; i < this.walls.length; i++) {
        //     let l = this.walls[i];
        //     ctx.beginPath();
        //     ctx.moveTo(l.points[0].x - this.game.camera.x, l.points[0].y - this.game.camera.y);
        //     ctx.lineTo(l.points[1].x - this.game.camera.x, l.points[1].y - this.game.camera.y);
        //     ctx.stroke();
        // }
        // for (let i = 0; i < this.lines.length; i++) {
        //     let l = this.lines[i];
        //     ctx.beginPath();
        //     ctx.moveTo(l.points[0].x - this.game.camera.x, l.points[0].y - this.game.camera.y);
        //     ctx.lineTo(l.points[1].x - this.game.camera.x, l.points[1].y - this.game.camera.y);
        //     ctx.stroke();
        // }

        ctx.beginPath();
        ctx.moveTo(this.x - this.game.camera.x, this.y - this.game.camera.y);
        for (let i = 0; i < this.lines.length; i++) {
            let l = this.lines[i];
            ctx.lineTo(l.points[1].x - this.game.camera.x, l.points[1].y - this.game.camera.y);
        }
        let l = this.lines[0];
        ctx.lineTo(l.points[1].x - this.game.camera.x, l.points[1].y - this.game.camera.y);
        ctx.fill();

        for (let i = 0; i < this.arc.length; i++) {
            let a = this.arc[i];
            ctx.beginPath();
            ctx.moveTo(a.x - this.game.camera.x, a.y - this.game.camera.y);
            ctx.arc(a.x - this.game.camera.x, a.y - this.game.camera.y, a.r, a.sa, a.ea);
            ctx.fill();
        }
    }
}

class Line {
    constructor(points) {
        this.points = points;
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
}