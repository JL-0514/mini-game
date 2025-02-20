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
        if ((wall instanceof HorizontalWall || wall instanceof BreakableHorizontalWall) 
            && getRightSide(this.radius, wall.BB.y - this.y)) {
            let original = new Line([{x: ul.x, y: ul.y}, {x: ur.x, y: ur.y}]);
            if (getDistance(ul, {x: this.x, y: this.y}) > this.radius) 
                ul.x = this.x - getRightSide(this.radius, wall.BB.y - this.y);
            if (getDistance(ur, {x: this.x, y: this.y}) > this.radius)
                ur.x = this.x + getRightSide(this.radius, wall.BB.y - this.y);
            let i = this.walls.length;
            if (original.pointOnLine(ul) && original.pointOnLine(ur)) {
                this.walls.push(new Line([ul, ur], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, ul], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, ur], i));
            }
        }

        // Only the left and right side of vertical wall can block the light
        if (this.x < wall.BB.x 
            && (wall instanceof VerticalWall || wall instanceof BreakableVerticalWall)) {
            let original = new Line([{x: ul.x, y: ul.y}, {x: ll.x, y: ll.y}]);
            if (getDistance(ul, {x: this.x, y: this.y}) > this.radius) 
                ul.y = this.y - getRightSide(this.radius, wall.BB.x - this.x);
            if (getDistance(ll, {x: this.x, y: this.y}) > this.radius)
                ll.y = this.y + getRightSide(this.radius, wall.BB.x - this.x);
            let i = this.walls.length;
            if (original.pointOnLine(ul) && original.pointOnLine(ll)) {
                this.walls.push(new Line([ul, ll], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, ul], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, ll], i));
            }
        }
        else if (this.x > wall.BB.x + wall.BB.width  
            && (wall instanceof VerticalWall || wall instanceof BreakableVerticalWall)) {
            let original = new Line([{x: ur.x, y: ur.y}, {x: lr.x, y: lr.y}]);
            if (getDistance(ur, {x: this.x, y: this.y}) > this.radius) 
                ur.y = this.y - getRightSide(this.radius, wall.BB.x + wall.BB.width - this.x);
            if (getDistance(lr, {x: this.x, y: this.y}) > this.radius)
                lr.y = this.y + getRightSide(this.radius, wall.BB.x + wall.BB.width - this.x);
            let i = this.walls.length;
            if (original.pointOnLine(ur) && original.pointOnLine(lr)) {
                this.walls.push(new Line([ur, lr], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, ur], i));
                this.lines.push(new Line([{x: this.x, y: this.y}, lr], i));
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
                if (intersect) {
                    let l = new Line([{x: this.x, y: this.y}, intersect], i)
                    this.lines.push(l);
                    corners.push(l);
                }
            }
        }
        // Remove light that intersect with wall
        for (let j = 0; j < this.walls.length; j++) {
            for (let i = this.lines.length - 1; i >= 0; --i) {
                let intersect = this.lines[i].collide(this.walls[j]);
                if (intersect) {
                    // Check if the light is partly blocked
                    let current = this.walls[this.lines[i].idx];
                    let l1 = Line.createLine({x: this.x, y: this.y}, this.walls[j].points[0], this.radius);
                    let l2 = Line.createLine({x: this.x, y: this.y}, this.walls[j].points[1], this.radius);
                    let newEnd = l1.collide(current);
                    if (!newEnd) newEnd = l2.collide(current);
                    if (newEnd) {
                        let end = {}
                        if (current.slope() !== false) end = {x: newEnd.x, y: current.points[0].y}
                        else end = {x: current.points[0].x, y: newEnd.y};
                        let l = new Line([{x: this.x, y: this.y}, end], this.lines[i].idx);
                        let count = 0;
                        for (let k = 0; k < this.walls.length && count < 1; k++) {
                            if (l.collide(this.walls[k])) count++;
                        }
                        if (count < 1) this.lines[i] = l;
                        else this.lines.splice(i, 1);
                    } else this.lines.splice(i, 1);
                }
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
            let angle = getAngle(a.points[0], a.points[1]) - getAngle(b.points[0], b.points[1]);
            if (Math.abs(angle) < 1e-8) {
                let da = getDistance(a.points[0], a.points[1]);
                let db = getDistance(b.points[0], b.points[1]);
                return db - da;
            }
            else return angle;
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
                if (temp.overlap(this.walls[j])) temp = false;
            }

            if (temp) {
                console.log(temp);
                let tp = {x: this.x, y: this.y};
                this.arc.push({x: this.x, y: this.y, r: this.radius, 
                    sa: getAngle(tp, p1) - Math.PI / 2, ea: getAngle(tp, p2) - Math.PI / 2});
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
