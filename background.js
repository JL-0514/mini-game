class VerticalWall {
    constructor(game, x, y, count) {
        Object.assign(this, { game, x, y, count });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/short-bricks.png");
    }

    update() {

    }

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                80, 128, 16, 16, 
                this.x - this.game.camera.x, this.y + PARAMS.BLOCK_SIZE * i - this.game.camera.y,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
        }
    }
}

class HorizontalWall {
    constructor(game, x, y, count) {
        Object.assign(this, { game, x, y, count });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/long-bricks.png");
    }

    update() {

    }

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                144, 32, 16, 32, 
                this.x + PARAMS.BLOCK_SIZE * i - this.game.camera.x, this.y - this.game.camera.y,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE * 2);
        }
    }
}

class BreakableVerticalWall {
    constructor(game, x, y, count) {
        Object.assign(this, { game, x, y, count });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/short-bricks.png");
    }

    update() {

    }

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                400, 0, 16, 16, 
                this.x - this.game.camera.x, this.y + PARAMS.BLOCK_SIZE * i - this.game.camera.y,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
        }
    }
}

class BreakableHorizontalWall {
    constructor(game, x, y, count) {
        Object.assign(this, { game, x, y, count });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/long-bricks.png");
    }

    update() {

    }

    draw(ctx) {
        for (let i = 0; i < this.count; i++) {
            ctx.drawImage(this.spritesheet, 
                288, 32, 16, 32, 
                this.x + PARAMS.BLOCK_SIZE * i - this.game.camera.x, this.y - this.game.camera.y,
                PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE * 2);
        }
    }
}

class Floor {
    constructor(game, x, y, xCount, yCount) {
        Object.assign(this, { game, x, y, xCount, yCount });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/floors.png");
    }

    update() {

    }

    draw(ctx) {
        for (let i = 0; i < this.xCount; i++) {
            for (let j = 0; j < this.yCount; j++) {
                ctx.drawImage(this.spritesheet, 
                    800, 1888, 32, 32,
                    this.x + PARAMS.BLOCK_SIZE * i - this.game.camera.x, 
                    this.y + PARAMS.BLOCK_SIZE * j - this.game.camera.y,
                    PARAMS.BLOCK_SIZE, PARAMS.BLOCK_SIZE);
            }
        }
    }
}