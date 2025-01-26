class SceneManager {
    constructor(game) {
        this.game = game;
        
        // Camera system
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.midpointX = PARAMS.CANVAS_WIDTH / 2 - PARAMS.WARRIOR_WIDTH / 2;
        this.midpointY = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.WARRIOR_HEIGHT / 2;

        this.currentMap = null;

        this.warrior = new Warrior(game, 5, 0);
        this.loadScene();
    }

    loadScene() {
        this.game.addEntity(this.warrior);
    }

    update() {
        // Make camera follow warrior
        this.x = this.warrior.x - this.midpointX;
        this.y = this.warrior.y - this.midpointY;
    }

    draw(ctx) {

    }
}