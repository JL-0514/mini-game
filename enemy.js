class Enemy {
    /**
     * 
     * @param {GameEngine} game The game engine.
     * @param {number} x The x-coordinate of the enemy.
     * @param {number} y The y-coordinate of the enemy.
     * @param {number} path Whether the enemy walks horizontally (0) or vertically (1).
     * @param {number} health Health of the enemy.
     * @param {number} attack Attack of the enemy.
     * @param {number} speed Speed of the enemy.
     * @param {number} view Radius of the area the enemy can detect the target.
     */
    constructor(game, x, y, path, health, attack, speed, view=400) {
        if (this.constructor == Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        Object.assign(this, { game, x, y, path, health, attack, speed, view });
        this.target = game.warrior;

        // 0=right, 1=left
        this.direction = 0;

        // Starting point
        this.start = {x: x, y: y};

        // Being attacked in the current attack
        this.attacked = false;

        // Time passed since current animation start
        this.elapsedTime = 0;
    }

    dealAttack(attack) {
        if (!this.attacked) {
            this.health -= attack;
            this.attacked = true;

            // Check if the enemy is alive
            if (this.health <= 0) {
                this.removeFromWorld = true;
                this.target.experience += 25;
            }
        }
        // Make enemy bounce off from the blade if attacked
        if (this.target.elapsedTime >= 0.42) {
            if (this.target.direction == 0) this.x += 3;
            else this.x -= 3;
        }
    }

    attackTarget(distance) {}

    /**
     * Chase and attack the target if the target is within a certain distance.
     */
    update() {
        // Update attacked status
        if (this.attacked && this.target.state != 2) this.attacked = false;

        // If out of range of camera, back to starting point
        if (this.x < this.game.camera.x || this.x > this.game.camera.x + PARAMS.CANVAS_WIDTH
            || this.y < this.game.camera.y || this.y > this.game.camera.y + PARAMS.CANVAS_HEIGHT) {
            this.x = this.start.x;
            this.y = this.start.y;
        }
        // If in range of camera, walk along a certain path until hit the wall
        else if (!this.attacked) {
            if (this.path == 0) {
                if (this.direction == 0) this.x += this.speed;
                else this.x -= this.speed;
            } else {
                if (this.direction == 0) this.y += this.speed;
                else this.y -= this.speed;
            }

            // Check if target is near
            let d = Math.abs(getDistance({x: this.target.BB.x + this.target.BB.width / 2, 
                y: this.target.BB.y + this.target.BB.height / 2}, 
                {x: this.BB.x + this.BB.width / 2, y: this.BB.y + this.BB.height / 2}));
            if (d <= this.view) this.attackTarget(d);
            else this.state = 0;
        }
    }

    draw(ctx) {
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    }

}
class Dregfly extends Enemy {
    constructor(game, x, y, path) {
        super(game, x, y, path, 70, 10, 2);

        this.scale = 90 / 40;
        this.width = 40 * this.scale;
        this.height = 30 * this.scale;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/dregfly.png");
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        // 0=idle, 1=attack
        this.state = 0;

        this.animations = [];
        this.loadAnimation();
    }

    loadAnimation() {
        for (var i = 0; i < 2; i++) { // 2 animations
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // 0. Idle
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 4, 40, 30, 4, 0.1, 0, true, true);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 0, 4, 40, 30, 4, 0.1, 0, false, true);

        // 1. Attack
        this.animations[1][0] = new Animator(this.spritesheet, 0, 1, 4, 40, 30, 4, 0.1, 0, true, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 1, 4, 40, 30, 4, 0.1, 0, false, true);
    }

    attackTarget(distance) {
        this.state = 1;
        // Change direction
        let dx = this.target.BB.x + this.target.BB.width / 2 - (this.BB.x + this.BB.width / 2);
        let dy = this.target.BB.y + this.target.BB.height / 2 - (this.BB.y + this.BB.height / 2);
        if (dx + this.target.BB.width / 2 < 0) this.direction = 1;
        else if (dx - this.target.BB.width / 2 > 0) this.direction = 0;
        // Move toward target and let collision detection deal with it
        this.x += dx / distance * this.speed;
        this.y += dy / distance * this.speed;
    }

    update() {
        super.update();
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }
}

class Wolf extends Enemy {
    constructor(game, x, y, path) {
        super(game, x, y, path, 50, 20, 2);
    }

    update() {

    }

    draw(ctx) {
        
    }
}

class Monster extends Enemy {
    constructor(game, x, y, path) {
        super(game, x, y, path, 30, 30, 2);
    }

    update() {

    }

    draw(ctx) {
        
    }
}