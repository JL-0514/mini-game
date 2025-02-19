class SceneManager {
    constructor(game) {
        this.game = game;

        // The main character
        this.warrior = new Warrior(game, 0, 0);
        this.game.warrior = this.warrior;
        
        // Camera system
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.midpointX = PARAMS.CANVAS_WIDTH / 2 - this.warrior.width / 2;
        this.midpointY = PARAMS.CANVAS_HEIGHT / 2 - this.warrior.height / 2;

        // Gameplay related
        this.keyCollected = 0;

        // Load map
        this.state = 0;     // 0=title, 1=maze scene, 2=ending screen
        this.title = new StartTransition(this.game);
        this.endScreen = new EndTransition(this.game);
        this.hud = new HUD(this.game, this.warrior);
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
                this.game.addEntity(new Crystal(this.game, e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE));
            });
        }
        if (scene.chest) {
            scene.chest.forEach(e => {
                let c = new Chest(this.game, e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE);
                this.game.addEntity(c);
                e.enemy.forEach(en => {
                    this.game.addEntity(new ENEMIES[en.type](this.game, c,
                        en.col * PARAMS.BLOCK_SIZE, en.row * PARAMS.BLOCK_SIZE, en.path));
                    c.enemyCount++;
                });
            });
        }
        if (scene.key) {
            scene.key.forEach(e => {
                this.game.addEntity(new Key(this.game,
                    e.col * PARAMS.BLOCK_SIZE, e.row * PARAMS.BLOCK_SIZE));
            });
        }

        // Load warrior
        this.warrior.x = scene.warrior.col * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - this.warrior.width / 2;
        this.warrior.y = scene.warrior.row * PARAMS.BLOCK_SIZE + PARAMS.BLOCK_SIZE / 2 - this.warrior.height / 2;
        this.game.addEntity(this.warrior);
        this.game.addEntity(this.warrior.blade);

        // Add stable light
        for (let i = 0; i < this.game.entities.length; i++) {
            let e1 = this.game.entities[i];
            if (!e1.light) continue;
            for (let j = 0; j < this.game.entities.length; j++) {
                let e2 = this.game.entities[j];
                if (e2 instanceof Wall && e1.light.BB.collide(e2.BB)) {
                    e1.light.addWall(e2);
                }
            }
            e1.light.checkLine();
            e1.light.createArc();
        }
    }

    update() {
        switch(this.state) {
            case 0:     // Title
                break;
            case 1:     // Maze
                this.x = this.warrior.x - this.midpointX;
                this.y = this.warrior.y - this.midpointY;
                this.hud.update();
                break;
            case 2:     // End
                this.endScreen.update();
                break;
        }
    }

    draw(ctx) {
        switch(this.state) {
            case 0:     // Title
                this.title.draw(ctx);
                break;
            case 1:     // Maze
                this.hud.draw(this.game.lightCtx);
                break;
            case 2:     // End
                this.endScreen.draw(ctx);
                break;
        }
    }
}