class Crystal {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spriteheet = ASSET_MANAGER.getAsset("./sprites/crystal.png");
        this.scale = 4;
        this.BB = new BoundingBox(this.x, this.y, 13 * this.scale, 16 * this.scale);
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.spriteheet, 81, 16, 13, 16, 
            this.x - this.game.camera.x, this.y - this.game.camera.y, 
            13 * this.scale, 16 * this.scale);
    }
}

class Chest {
    constructor(game, x, y) {   // TODO: Add count or monsters
        Object.assign(this, { game, x, y });
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

}