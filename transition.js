class StartTransition {
    constructor(game) {
        this.game = game;
    }

    update() {

    }

    draw(ctx) {
        
    }
}

class EndTransition {
    constructor(game) {
        this.game = game;
        this.background = ASSET_MANAGER.getAsset("./sprites/title.png");
        this.alpha = 0;
        this.elapsedTime = 0;
        this.duration = 2;
    }

    update() {
        this.alpha += this.game.clockTick / 2;
        this.elapsedTime += this.game.clockTick;
        if (this.elapsedTime >= this.duration) {
            this.game.entity = [];
        }
    }

    draw(ctx) {
        if (this.elapsedTime < this.duration) {     // Generally make the screen darker
            ctx.fillStyle = rgba(0, 0, 0, this.alpha);
            ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        } else {    // Draw ending screen
            ctx.drawImage(this.background, 0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
            ctx.fillStyle = "white";
            ctx.font = "40px 'Rubik Distressed'"
            let w = ctx.measureText("CONGRATULATION").width;
            ctx.fillText("CONGRATULATION", PARAMS.CANVAS_WIDTH / 2 - w / 2, PARAMS.CANVAS_HEIGHT / 2);
            w = ctx.measureText("YOU ESCAPED").width;
            ctx.fillText("YOU ESCAPED", PARAMS.CANVAS_WIDTH / 2 - w / 2, PARAMS.CANVAS_HEIGHT / 2 + 45);
        }
    }
}