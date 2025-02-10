class Warrior {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritsheet = ASSET_MANAGER.getAsset("./sprites/warrior.png");

        /** Scale of the warrior. */
        this.scale = 207 / 69;

        /** Width of the frame of the warrior. */
        this.width = 69 * this.scale;

        /** Height of the frame of the warrior. */
        this.height = 44 * this.scale;

        /** State of the warrior (which animation to draw): 0=idle, 1=run, 2=attack, 3=hurt 4=death */
        this.state = 0;

        /** Direction of the warrior: 0=right, 1=left */
        this.direction = 0; 

        /** Whether the warrior is visible. */
        this.isLighting = true;


        /** Speed of running */
        this.speed = 8;

        /** Warrior's attack power. */
        this.attack = 10;

        /** Warrior's current health */
        this.health = 200;

        /** Warrior's maximum health */
        this.maxHealth = 200;

        /** The blade used to attack. */
        this.blade = new Blade(this.game, this);


        /** Radius of the circle of visible range. */
        this.view = 200;

        /** Experience of current level. */
        this.experience = 0;

        /** Experience needed to level up. */
        this.expToNextLevel = 30;

        /** The current level. */
        this.level = 0;

        /** Number of crystal owned. */
        this.crystal = 2;

        /** Number of health portion warrior has. */
        this.healthPortion = 0;

        /** Number of axe warrior has. */
        this.axe = 1;


        /** Time passed since current animation start. */
        this.elapsedTime = 0;

        /** Whether the warrior enter the state which cannot be hurt. */
        this.noDamage = false;

        /** Time passed since the warrior get hurt. */
        this.elapsednoDamageTime = 0;

        /** List of animations */
        this.animations = [];
        this.loadAnimations();
        this.updateBB();
    }

    loadAnimations() {
        for (var i = 0; i < 5; i++) { // 5 animations
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // 0. Idle
        this.animations[0][0] = new Animator(this.spritsheet, 0, 0, 6, 69, 44, 6, 0.15, 0, false, true);
        this.animations[0][1] = new Animator(this.spritsheet, 0, 0, 6, 69, 44, 6, 0.15, 0, true, true);

        // 1. Run
        this.animations[1][0] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.1, 0, false, true);
        this.animations[1][1] = new Animator(this.spritsheet, 0, 1, 6, 69, 44, 8, 0.1, 0, true, true);

        // 2. Attack
        this.animations[2][0] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.07, 0, false, true);
        this.animations[2][1] = new Animator(this.spritsheet, 2, 2, 6, 69, 44, 12, 0.07, 0, true, true);

        // 3. Hurt
        this.animations[3][0] = new Animator(this.spritsheet, 1, 6, 6, 69, 44, 4, 0.1, 0, false, true);
        this.animations[3][1] = new Animator(this.spritsheet, 1, 6, 6, 69, 44, 4, 0.1, 0, true, true);

        // 4. Death
        this.animations[4][0] = new Animator(this.spritsheet, 2, 4, 6, 69, 44, 11, 0.12, 0, false, false);
        this.animations[4][1] = new Animator(this.spritsheet, 2, 4, 6, 69, 44, 11, 0.12, 0, true, false);
    }

    /**
     * Update player's state, direction, position, and bounding box
     * - If the warrior is attacking, check the elapsed time. If less than total time, update elapsed time only.
     *   Else, finish attacking and reset elapsed time.
     * - If the warrior is about to start attack, stop current action and start attack. Update state only.
     * - If the warrior is moving, update state, direction, and position.
     * - If no key or mouse event, change state to idle.
     */
    update() {
        // Check if the warrior die
        if (this.health <= 0) {     // Dead
            this.state = 4;
        } 
        // Attacking, update tine
        else if (this.state == 2) { 
            this.elapsedTime += this.game.clockTick;
            if (this.elapsedTime >= 0.84) {
                this.elapsedTime = 0;
                this.state = 0;
            }
        } 
        // Get attacked, update time and change to no damage state
        else if (this.state == 3) {
            this.elapsedTime += this.game.clockTick;
            if (this.elapsedTime >= 0.4) {
                this.elapsedTime = 0;
                this.state = 0;
                this.noDamage = true;
            }
        }
        // Dead, play animation and display game over screen
        else if (this.state == 4) {
            this.elapsedTime += this.game.clockTick;
            if (this.elapsedTime >= 1.32) {
                this.elapsedTime = 0;
                this.removeFromWorld = true;    // TODO: Replace with game over screen
            }
        } 
        // Detect click, start attack
        else if (this.game.click != null) {
            this.state = 2;
        } 
        // Detect keys, update position and direciton
        else if (this.game.keyA || this.game.keyD || this.game.keyS || this.game.keyW) {  // Running
            if (this.game.keyA) {
                this.x -= this.speed;
                this.direction = 1;
            }
            if (this.game.keyD) {
                this.x += this.speed;
                this.direction = 0;
            }
            if (this.game.keyS) {
                this.y += this.speed;
            }
            if (this.game.keyW) {
                this.y -= this.speed;
            }
            this.state = 1;
        } 
        // No action, idle state
        else {
            this.state = 0;
        }

        // Update "No Damage" state
        if (this.noDamage) {
            this.elapsednoDamageTime += this.game.clockTick;
            if (this.elapsednoDamageTime >= 1.5) {
                this.noDamage = false;
                this.elapsednoDamageTime = 0;
            }
        }

        // Level up
        if (this.experience >= this.expToNextLevel) {
            this.level++;
            this.experience %= 30;
            this.expToNextLevel += 5;
            this.attack += 2;
            let perc = this.health / this.maxHealth;
            this.maxHealth += 10;
            this.health = Math.round(this.maxHealth * perc);
        }

        // Update bounding box
        this.updateBB();
    }

    updateBB() {
        switch(this.state) {
            case 0:
                this.BB = new BoundingBox(this.x + (16 + 16 * this.direction) * this.scale, this.y + 10 * this.scale, 
                                        21 * this.scale, 33 * this.scale);
                break;
            case 1:
                this.BB = new BoundingBox(this.x + (11 + 16 * this.direction) * this.scale, this.y + 10 * this.scale, 
                                        31 * this.scale, 33 * this.scale);
                break;
            case 2: case 3:
                this.BB = new BoundingBox(this.x + (16 + 13 * this.direction)  * this.scale, this.y + 10 * this.scale, 
                                        24 * this.scale, 33 * this.scale);
                break;
        }
    }

    draw(ctx) {
        this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    }
}

/**
 * The blade the warrior hold. Used to set bounding box.
 */
class Blade {
    constructor(game, warrior) {
        Object.assign(this, { game, warrior });
    }

    update() {
        if (this.warrior.state == 2) {
            this.BB = new BoundingBox(this.warrior.x + (40 - 36 * this.warrior.direction) * this.warrior.scale, 
                        this.warrior.y + 10 * this.warrior.scale, 
                        25 * this.warrior.scale, 33 * this.warrior.scale);
        } else {
            this.BB = new BoundingBox(0, 0, 0, 0);
        }
    }

    draw(ctx) {
    }
}