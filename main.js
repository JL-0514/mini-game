const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Sprite sheets
ASSET_MANAGER.queueDownload("./sprites/warrior.png");
ASSET_MANAGER.queueDownload("./sprites/long-bricks.png");
ASSET_MANAGER.queueDownload("./sprites/short-bricks.png");
ASSET_MANAGER.queueDownload("./sprites/floors.png");
ASSET_MANAGER.queueDownload("./sprites/chest.png");
ASSET_MANAGER.queueDownload("./sprites/crystal.png");
ASSET_MANAGER.queueDownload("./sprites/dregfly.png");
ASSET_MANAGER.queueDownload("./sprites/key.png");
ASSET_MANAGER.queueDownload("./sprites/monster.png");
ASSET_MANAGER.queueDownload("./sprites/title.png");
ASSET_MANAGER.queueDownload("./sprites/wolf.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();
});
