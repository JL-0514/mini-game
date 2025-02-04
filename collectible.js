class Crystal {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spriteheet = ASSET_MANAGER.getAsset("./sprites/crystal.png");
        this.scale = 4;
        this.width = 13 * this.scale;
        this.height = 16 * this.scale;
        this.isLighting = true;
        this.view = 100;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spriteheet, 81, 16, 13, 16, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, 
            this.width, this.height);
    }
}

class Chest {
    constructor(game, x, y, enemy) {   // TODO: Add count or monsters
        Object.assign(this, { game, x, y, enemy });
        this.spriteheet = ASSET_MANAGER.getAsset("./sprites/chest.png");
        this.opened = false;
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
    }

    update() {

    }

    draw(ctx) {
        if (this.opened) {
            ctx.drawImage(this.spriteheet, 0, 64, 32, 32, 
                this.x - this.game.camera.x, this.y - this.game.camera.y, 
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
        } else {
            ctx.drawImage(this.spriteheet, 32, 64, 32, 32, 
                this.x - this.game.camera.x, this.y - this.game.camera.y, 
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
        }
    }
}

class Key {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spriteheet = ASSET_MANAGER.getAsset("./sprites/key.png");
        this.scale = 4;
        this.width = 16 * this.scale;
        this.height = 16 * this.scale;
        this.isLighting = true;
        this.view = 100;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.animation = new Animator(this.spriteheet, 0, 0, 4, 16, 16, 8, 0.2, 0, false, true);
    }

    update() {

    }

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
    }
}