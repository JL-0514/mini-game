class SceneManager {
    constructor(game) {
        this.game = game;
        this.warrior = new Warrior(game, 5, 0);
        this.loadScene();
    }

    loadScene() {

        this.warrior.state = 1;
        this.game.addEntity(this.warrior);

        // More warriors for demonstration
        let warriorRunLeft = new Warrior(this.game, 700, 3 * 45);
        warriorRunLeft.state = 1;
        warriorRunLeft.direction = 1;
        this.game.addEntity(warriorRunLeft);

        let warriorAttackRight = new Warrior(this.game, 5, 6 * 45);
        warriorAttackRight.state = 2;
        this.game.addEntity(warriorAttackRight);

        let warriorAttackLeft = new Warrior(this.game, 5 + 3 * 70, 6 * 45);
        warriorAttackLeft.state = 2;
        warriorAttackLeft.direction = 1;
        this.game.addEntity(warriorAttackLeft);
    }

    update() {

    }

    draw(ctx) {

    }
}