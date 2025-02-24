class Shadow {
    constructor(game, owner) {
        Object.assign(this, { game, owner });
        this.lightSources = [];
        this.length = [];
        this.angle = [];
        this.segment= [];
        this.leftBound = null;
        this.rightBound = null;
        this.lowerBound = null;
    }
    
    update() {
        this.length = [];
        this.angle = [];
        this.segment= [];
        this.leftBound = null;
        this.rightBound = null;
        this.lowerBound = null;

        for (let i = 0; i < this.lightSources.length; i++) {
            let light = this.lightSources[i];
            // Distance between characer and light source in term of their x-coordinate
            let d = getDistance({x: light.x, y: light.y + light.assumeHeight}, 
                {x: this.owner.BB.x + this.owner.BB.width / 2, y: this.owner.BB.y + this.owner.BB.height});
            // Anle between light source and the top of the characer
            let a = Math.atan2(d, this.owner.BB.height + light.assumeHeight - this.owner.BB.height);
            let l = Math.abs(Math.sin(a) * light.assumeHeight - d);
            if (l + d > light.radius) this.length.push(light.radius - d);
            else this.length.push(l);
            this.angle.push(Math.atan2(light.y - this.owner.BB.y,
                light.x - this.owner.BB.x + this.owner.BB.width / 2) - Math.PI / 2);
            
            // Determine whether the shadow is cast on the wall
            this.segment.push([]);
            let s = Line.createLineByAngle({x: this.owner.BB.x + this.owner.BB.width / 2, 
                y: this.owner.BB.y + this.owner.BB.height}, this.angle[i], this.length[i] + 50);
            light.turn.forEach(t => {
                let collide = t.collide(s);
                if (collide) {
                    this.segment[i].push({x: collide.x, y: t.points[0].y});
                    this.segment[i].push({
                        x: collide.x, 
                        y: t.points[0].y - light.assumeHeight + Math.cos(a) * getDistance(collide, 
                            {x: light.x, y: light.y + light.assumeHeight}),
                        line: t});
                }
                
            });
            light.cut.forEach(c => {
                let collide = c.collide(s);
                if (collide) {
                    if (c.points[0].x === c.points[1].x && this.owner.BB.x < c.points[0].x)
                        this.rightBound = c.points[0].x;
                    else if (c.points[0].x === c.points[1].x && this.owner.BB.x > c.points[0].x) 
                        this.leftBound = c.points[0].x;
                    else if (c.points[0].y === c.points[1].y && this.owner.BB.y + this.owner.BB.height < c.points[0].y)
                        this.lowerBound = c.points[0].y;
                    s = new Line([{x: this.owner.BB.x + this.owner.BB.width / 2, 
                        y: this.owner.BB.y + this.owner.BB.height}, {x: c.points[0].x, y: collide.y}]);
                }
                
            });
        }

        // Clear shadow in previous move
        this.lightSources = [];
    }
}