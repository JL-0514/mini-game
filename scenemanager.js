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

        this.warrior = new Warrior(game,0, 0);
        this.loadScene(MAP);
    }

    loadScene(scene) {
        // Load backgroud
        if (scene.floor) {
            scene.floor.forEach(e => {
                this.game.addEntity(new Floor(this.game, 
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE, 
                    e.endCol - e.col, e.endRow - e.row));
            });
        }
        if (scene.horizontalWall) {
            scene.horizontalWall.forEach(e => {
                this.game.addEntity(new HorizontalWall(this.game, 
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE, e.endCol - e.col));
            });
        }
        if (scene.breakableHorizontalWall) {
            scene.breakableHorizontalWall.forEach(e => {
                this.game.addEntity(new BreakableHorizontalWall(this.game, 
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE, e.endCol - e.col));
            });
        }
        if (scene.verticalWall) {
            scene.verticalWall.forEach(e => {
                this.game.addEntity(new VerticalWall(this.game, 
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE, e.endRow - e.row));
            });
        }
        if (scene.breakableVerticalWall) {
            scene.breakableVerticalWall.forEach(e => {
                this.game.addEntity(new BreakableVerticalWall(this.game, 
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE, e.endRow - e.row));
            });
        }

        // Load warrior
        this.warrior.x = scene.warrior.col * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - PARAMS.WARRIOR_WIDTH / 2;
        this.warrior.y = scene.warrior.row * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - PARAMS.WARRIOR_HEIGHT / 2;
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