class Enemy {
    /**
     * Create an enemy entity.
     * 
     * @param {GameEngine} game The game engine.
     * @param {number} x The x-coordinate of the enemy.
     * @param {number} y The y-coordinate of the enemy.
     * @param {number} path Whether the enemy walks horizontally (0) or vertically (1).
     * @param {number} maxHealth Maximum health of the enemy.
     * @param {number} attack Attack of the enemy.
     * @param {number} speed Speed of the enemy.
     * @param {number} view Radius of the area the enemy can detect the target.
     */
    constructor(game, x, y, path, maxHealth, attack, speed, view=400) {
        if (this.constructor == Enemy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        Object.assign(this, { game, x, y, path, maxHealth, attack, speed, view });
        this.target = game.warrior;

        // 0=right, 1=left
        this.direction = 0;

        this.health = maxHealth;

        // Starting point
        this.start = {x: x, y: y};

        // Being attacked in the current attack
        this.attacked = false;

        this.outOfScene = false;

        this.healthSprite = ASSET_MANAGER.getAsset("./sprites/health-bar.png");
        this.healthScale = 2;
        this.healthSize = this.healthScale * 8;
    }

    /**
     * Deal with a specific amount of damage.
     * 
     * @param {number} attack The amount of damage.
     */
    dealAttack(attack) {
        // Check if the enemy has been attack from current click. 
        // Prevent making more than one attack as blade collide with enemy
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

    // Specified in each class, different enemies may have different way to attack
    attackTarget(distance) {
        if (distance < 80) {
            this.target.direction = this.target.BB.left < this.BB.left ? 0 : 1;
        }
    }

    /**
     * Chase and attack the target if the target is within a certain distance.
     */
    update() {
        // Update attacked status, check if the warrior stop attack
        if (this.attacked && this.target.state != 2) this.attacked = false;

        // If out of range of camera, back to starting point
        this.outOfScene = this.BB.left + this.BB.width < this.game.camera.x 
                        || this.BB.left > this.game.camera.x + PARAMS.CANVAS_WIDTH
                        || this.BB.top + this.BB.height < this.game.camera.y 
                        || this.BB.top > this.game.camera.y + PARAMS.CANVAS_HEIGHT;
        if (this.outOfScene) {
            this.x = this.start.x;
            this.y = this.start.y;
        }
        // If in range of camera, walk along a certain path until hit the wall
        else if (!this.attacked) {
            // Check if target is near
            let d = Math.abs(getDistance({x: this.target.BB.x + this.target.BB.width / 2, 
                y: this.target.BB.y + this.target.BB.height / 2}, 
                {x: this.BB.x + this.BB.width / 2, y: this.BB.y + this.BB.height / 2}));
            if (d <= this.view) this.attackTarget(d);
            else {
                // Walking along a certain path
                this.state = 0;
                if (this.path == 0) {
                    if (this.direction == 0) this.x += this.speed;
                    else this.x -= this.speed;
                } else {
                    if (this.direction == 0) this.y += this.speed;
                    else this.y -= this.speed;
                }
            }
        }
        console.log(this.health);
    }

    draw(ctx) {
        if (!this.outOfScene) {
            this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, 
                this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
            
            // Draw health bar
            let bar = Math.ceil(this.maxHealth / 20);
            let barX = this.x + this.width / 2 - bar * this.healthSize / 2;
            let barY = this.BB.y - 20;
            for (let i = 0; i < bar; i++) {
                if (this.health >= (i + 1) * 20) {
                    ctx.drawImage(this.healthSprite, 0, 0, 8, 8, 
                        barX - this.game.camera.x, barY - this.game.camera.y, this.healthSize, this.healthSize);
                } else if (this.health >= (i + 1) * 20 - 10) {
                    ctx.drawImage(this.healthSprite, 8, 0, 8, 8, 
                        barX - this.game.camera.x, barY - this.game.camera.y, this.healthSize, this.healthSize);
                } else {
                    ctx.drawImage(this.healthSprite, 16, 0, 8, 8, 
                        barX - this.game.camera.x, barY - this.game.camera.y, this.healthSize, this.healthSize);
                }
                barX += this.healthSize;
            }
        }
    }

}

class Dregfly extends Enemy {
    constructor(game, x, y, path) {
        super(game, x, y, path, 80, 10, 2);

        this.scale = 90 / 40;
        this.width = 40 * this.scale;
        this.height = 30 * this.scale;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/dregfly.png");
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        // 0=walking, 1=attack
        this.state = 1;

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

        // 0. Walking
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 4, 40, 30, 4, 0.1, 0, true, true);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 0, 4, 40, 30, 4, 0.1, 0, false, true);

        // 1. Attack
        this.animations[1][0] = new Animator(this.spritesheet, 0, 1, 4, 40, 30, 4, 0.1, 0, true, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 1, 4, 40, 30, 4, 0.1, 0, false, true);
    }

    /**
     * Chase the target and start attack. No projectile.
     * 
     * @param {number} distance The distance to the target.
     */
    attackTarget(distance) {
        super.attackTarget(distance);
        this.state = distance < 30 ? 1 : 0;
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
        super(game, x, y, path, 60, 20, 1.5);

        this.scale = 200 / 96;
        this.width = 96 * this.scale;
        this.height = 96 * this.scale;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolf.png");

        // 0=walking, 1=attack
        this.state = 0;

        this.animations = [];
        this.loadAnimation();
        this.updateBB();
    }

    loadAnimation() {
        for (var i = 0; i < 2; i++) { // 2 animations
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // 0. Walking
        this.animations[0][0] = new Animator(this.spritesheet, 0, 1, 5, 96, 96, 4, 0.2, 0, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 1, 5, 96, 96, 4, 0.2, 0, true, true);

        // 1. Attack
        this.animations[1][0] = new Animator(this.spritesheet, 0, 2, 5, 96, 96, 5, 0.2, 0, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 2, 5, 96, 96, 5, 0.2, 0, true, true);
    }

    /**
     * Chase the target and start attack. No projectile.
     * 
     * @param {number} distance The distance to the target.
     */
    attackTarget(distance) {
        super.attackTarget(distance);
        if (distance > 120) this.state = 0;
        if (this.state == 0 && this.BB.collide(this.target.BB)) {
            this.animations[1][0].elapsedTime = 0;
            this.animations[1][1].elapsedTime = 0;
            this.state = 1;
        }
        // Change direction
        let dx = this.target.BB.x + this.target.BB.width / 2 - (this.BB.x + this.BB.width / 2);
        let dy = this.target.BB.y + this.target.BB.height / 2 - (this.BB.y + this.BB.height / 2);
        if (dx + this.target.BB.width / 2 < 0) this.direction = 1;
        else if (dx - this.target.BB.width / 2 > 0) this.direction = 0;
        // Move toward target and let collision detection deal with it
        this.x += dx / distance * this.speed;
        this.y += dy / distance * this.speed;
    }

    updateBB() {
        if (this.state == 0) this.BB = new BoundingBox(this.x + (29 - 12 * this.direction) * this.scale, 
                            this.y + 28 * this.scale, 50 * this.scale, 44 * this.scale);
        else {
            if (this.animations[this.state][this.direction].elapsedTime < 0.6) 
                this.BB = new BoundingBox(this.x + (28 + 10 * this.direction) * this.scale,
                            this.y + 28 * this.scale, 30 * this.scale, 44 * this.scale);
            else this.BB = new BoundingBox(this.x + (28 - 22 * this.direction) * this.scale, 
                            this.y + 28 * this.scale, 62 * this.scale, 44 * this.scale);
        }
    }

    update() {
        super.update();
        this.updateBB(); 
    }
}

class Monster extends Enemy {
    constructor(game, x, y, path) {
        super(game, x, y, path, 40, 30, 2.5);

        this.scale = 150 / 64;
        this.width = 64 * this.scale;
        this.height = 64 * this.scale;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/monster.png");

        // 0=walking, 1=attack
        this.state = 0;

        // Time gap between each attack.
        this.attackGap = 1.7;

        // Time passed since last attack.
        this.attackElapsedTime = 1.7;

        this.animations = [];
        this.loadAnimation();
        this.updateBB();
    }

    loadAnimation() {
        for (var i = 0; i < 2; i++) { // 2 animations
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // 0. Walking
        this.animations[0][0] = new Animator(this.spritesheet, 0, 1, 4, 64, 64, 4, 0.15, 0, true, true);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 1, 4, 64, 64, 4, 0.15, 0, false, true);

        // 1. Attack
        this.animations[1][0] = new Animator(this.spritesheet, 0, 2, 4, 64, 64, 8, 0.15, 0, true, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 2, 4, 64, 64, 8, 0.15, 0, false, true);
    }

    updateBB() {
        if (this.state == 0)
            this.BB = new BoundingBox(this.x + 7 * this.scale, this.y + 19 * this.scale,
                        52 * this.scale, 32 * this.scale);
        else 
            this.BB = new BoundingBox(this.x + 12 * this.scale, this.y + 19 * this.scale,
                        40 * this.scale, 38 * this.scale);   
    }

    /**
     * Chase the target and start attack. Create a projectile to sttack.
     * 
     * @param {number} distance The distance to the target.
     */
    attackTarget(distance) {
        super.attackTarget(distance);
        // Change direction
        let dx = this.target.BB.x + this.target.BB.width / 2 - (this.BB.x + this.BB.width / 2);
        let dy = this.target.BB.y + this.target.BB.height / 2 - (this.BB.y + this.BB.height / 2);
        if (dx + this.target.BB.width / 2 < 0) this.direction = 1;
        else if (dx - this.target.BB.width / 2 > 0) this.direction = 0;

        if (distance > 300) {
            this.attackElapsedTime = this.attackGap;
        } else if (distance > 240) {
            // Move toward target and let collision detection deal with it
            this.x += dx / distance * this.speed;
            this.y += dy / distance * this.speed;
            this.state = 0;
        } else {
            this.attackElapsedTime += this.game.clockTick;
            if (this.attackElapsedTime >= this.attackGap) {
                this.game.addEntity(new Projectile(this.game, this.spritesheet, Math.atan2(dx, -dy), 
                    this.BB.x + this.BB.width / 2 - 50, this.BB.y + this.BB.height / 2 - 50, 64, 64, 100, 
                    6, this.attack));
                this.state = 1;
                this.attackElapsedTime = 0;
                this.animations[1][0].elapsedTime = 0;
                this.animations[1][1].elapsedTime = 0;
            } else if (this.attackElapsedTime >= 1.2) this.state = 0;
        }
    }

    update() {
        super.update();
        this.updateBB();
    }
}

/**
 * Projectile from enemy.
 */
class Projectile {
    /**
     * Create a projectile that will attack the warrior.
     * 
     * @param {GameEngine} game The game engine.
     * @param {*} spritesheet The spritesheet for the projectile.
     * @param {*} angle The angle the projectile will move toward.
     * @param {*} x The x-coordinate of the projectile.
     * @param {*} y The y-coordinate of the projectile.
     * @param {*} fw The frame width of the projectile in the spritesheet.
     * @param {*} fh The frame height of the projectile in the spritesheet.
     * @param {*} width The intended width of the projectile on the canvas.
     * @param {*} speed The speed of the projectile.
     */
    constructor(game, spritesheet, angle, x, y, fw, fh, width, speed, attack) {
        Object.assign(this, { game, spritesheet, angle, x, y, fw, fh, width, speed, attack });

        this.scale = width/ fw;
        this.height = fh * this.scale;
        this.canvasSize = Math.ceil(Math.sqrt(this.width * this.width + this.height * this.height));

        // 1=shot, 0=destroy
        this.state = 1;

        this.animations = [];
        this.loadAnimation();

        this.BB = new BoundingBox(this.x + 21 * this.scale, this.y + 22 * this.scale,
            18 * this.scale, 18 * this.scale);
    }

    loadAnimation() {
        for (var i = 0; i < 2; i++) { // 2 animations
            this.animations.push([]);
        }

        // 1. Shot
        this.animations[1] = new Animator(this.spritesheet, 3, 8, 4, this.fw, this.fh, 3, 0.1, 0, false, true);

        // 0. Destroy
        this.animations[0] = new Animator(this.spritesheet, 2, 9, 4, this.fw, this.fh, 5, 0.1, 0, false, false);
    }

    update() {
        if (this.state == 1) {
            this.x += Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;
            this.BB = new BoundingBox(this.x + 21 * this.scale, this.y + 22 * this.scale,
                18 * this.scale, 18 * this.scale);
        } else if (this.animations[0].elapsedTime >= 0.5) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        let rotateCanvas = document.createElement("canvas");
        rotateCanvas.width = this.canvasSize;
        rotateCanvas.height = this.canvasSize;
        let rotateCtx = rotateCanvas.getContext("2d");
        rotateCtx.imageSmoothingEnabled = true;
        rotateCtx.save();
        rotateCtx.translate(this.canvasSize / 2, this.canvasSize / 2);
        rotateCtx.rotate(this.angle + Math.PI / 2);
        rotateCtx.translate(-this.canvasSize / 2, -this.canvasSize / 2);
        this.animations[this.state].drawFrame(this.game.clockTick, rotateCtx, 
            this.canvasSize / 2 - this.width / 2, this.canvasSize / 2 - this.width / 2, this.scale);
        rotateCtx.restore();
        ctx.drawImage(rotateCanvas, this.x - this.game.camera.x, this.y - this.game.camera.y, this.width, this.height);
    }
}