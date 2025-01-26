class Warrior {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritsheet = ASSET_MANAGER.getAsset("./sprites/warrior.png");

        /** Scale of the warrior. */
        this.scale = PARAMS.WARRIOR_WIDTH / 69;

        /** State of the warrior (which animation to draw): 0=idle, 1=run, 2=attack */
        this.state = 0;

        /** Direction of the warrior: 0=right, 1=left */
        this.direction = 0; 

        /** Speed of running */
        this.speed = 3;

        /** Warrior's attack power. */
        this.attack = 10;

        /** Time required to finish attack (attack can't be stop by other action). Total = # of frame * frame duration.*/
        this.totalAttackTime = 0.07 * 12;

        /** Time passed since the warrior start attack. */
        this.elapsedAttackTime = 0;

        /** List of animations */
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
        this.animations[1][0] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.1, false, true);
        this.animations[1][1] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.1, true, true);

        // 1. Attack
        this.animations[2][0] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.07, false, true);
        this.animations[2][1] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.07, true, true);
    }

    /**
     * Update player's state, direction, and position
     * - If the warrior is attacking, check the elapsed time. If less than total time, update elapsed time only.
     *   Else, finish attacking and reset elapsed time.
     * - If the warrior is about to start attack, stop current action and start attack. Update state only.
     * - If the warrior is moving, update state, direction, and position.
     * - If no key or mouse event, change state to idle.
     */
    update() {
        if (this.state == 2) {
            this.elapsedAttackTime += this.game.clockTick;
            if (this.elapsedAttackTime >= this.totalAttackTime) {
                this.elapsedAttackTime = 0;
                this.state = 0;
            }
        } else if (this.game.click != null) {
            this.state = 2;
        } else if (this.game.keyDown) {
            if (this.game.keyA) {
                this.x -= this.speed;
                this.direction = 1;
                this.state = 1;
            }
            if (this.game.keyD) {
                this.x += this.speed;
                this.direction = 0;
                this.state = 1;
            }
            if (this.game.keyS) {
                this.y += this.speed;
                this.state = 1;
            }
            if (this.game.keyW) {
                this.y -= this.speed;
                this.state = 1;
            }
        } else {
            this.state = 0;
        }
    }

    draw(ctx) {
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    }
}