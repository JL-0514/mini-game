class SceneManager {
    constructor(game) {
        this.game = game;
        
        // Camera system
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.midpointX = PARAMS.CANVAS_WIDTH / 2 - PARAMS.WARRIOR_WIDTH / 2;
        this.midpointY = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.WARRIOR_HEIGHT / 2;

        // The main character
        this.warrior = new Warrior(game,0, 0);
        this.game.warrior = this.warrior;

        // Gameplay related
        this.keyCollected = 4;

        // Load map
        this.state = 0;     // 0=title, 1=maze scene, 2=ending screen

        this.title = new StartTransition(this.game);
        this.endScreen = new EndTransition(this.game);

        this.currentMap = null;
        this.loadScene(MAZE);
    }

    loadScene(scene) {
        this.state = scene.state;
        
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

        // Load collectibles
        if (scene.crystal) {
            scene.crystal.forEach(e => {
                this.game.addEntity(new Crystal(this.game,
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE));
            });
        }
        if (scene.chest) {
            scene.chest.forEach(e => {
                this.game.addEntity(new Chest(this.game,
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE));
            });
        }
        if (scene.key) {
            scene.key.forEach(e => {
                this.game.addEntity(new Key(this.game,
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE));
            });
        }

        // Load warrior
        this.warrior.x = scene.warrior.col * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - PARAMS.WARRIOR_WIDTH / 2;
        this.warrior.y = scene.warrior.row * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - PARAMS.WARRIOR_HEIGHT / 2;
        this.game.addEntity(this.warrior);
        this.game.addEntity(this.warrior.blade);
    }

    update() {
        // Make camera follow warrior
        this.x = this.warrior.x - this.midpointX;
        this.y = this.warrior.y - this.midpointY;

        if (this.state == 2) this.endScreen.update();
    }

    draw(ctx) {
        if (this.state == 2) this.endScreen.draw(ctx);
    }
}