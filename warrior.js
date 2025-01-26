class Warrior {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritsheet = ASSET_MANAGER.getAsset("./sprites/warrior.png");

        // State: 0=idle, 1=run, 3=attack
        this.state = 0;

        // Direction: 0=right, 1=left
        this.direction = 0; 

        // Speed of running
        this.speed = 3;

        this.animations = [];
        this.loadAnimations();
    }

    loadAnimations() {
        for (var i = 0; i < 8; i++) { // 7 animations
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // 0. Idle
        this.animations[0][0] = new Animator(this.spritsheet, 0, 0, 6, 69, 44, 6, 0.15, false, true);
        this.animations[0][1] = new Animator(this.spritsheet, 0, 0, 6, 69, 44, 6, 0.15, true, true);

        // 1. Run
        this.animations[1][0] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.15, false, true);
        this.animations[1][1] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.15, true, true);

        // 1. Attack
        this.animations[2][0] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.15, false, true);
        this.animations[2][1] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.15, true, true);
    }

    update() {
        if (this.state == 1) {
            if (this.direction == 0) this.x = this.x + this.speed;
            else this.x = this.x - this.speed;
        }
    }

    draw(ctx) {
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
}