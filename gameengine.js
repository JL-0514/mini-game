// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the mouse input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        
        // Information on the key input
        this.keyA = false;
        this.keyD = false;
        this.keyW = false;
        this.keyS = false;
        this.keyDown = false;

        this.clockTick = null;

        // Event listeners
        this.listeners = [];

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        // Mouse move listener
        const mouseMoveListener = e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        };
        this.ctx.canvas.addEventListener("mousemove", mouseMoveListener, false);
        this.listeners.move = mouseMoveListener;

        // Mouse left-click listener
        const leftClickListener = e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        };
        this.ctx.canvas.addEventListener("click", leftClickListener, false);
        this.listeners.leftClick = leftClickListener;

        // Mouse wheel listener
        const wheelListener = e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e.wheelDelta;
        };
        this.ctx.canvas.addEventListener("wheel", wheelListener, false);
        this.listeners.wheel = wheelListener;

        // Key down listener
        const keyDownListener = e => {
            this.keyDown = true;
            switch (e.code) {
                case "KeyA":
                    if (!this.keyD) this.keyA= true;
                    break;
                case "KeyD":
                    if (!this.keyA) this.keyD = true;
                    break;
                case "KeyW":
                    if (!this.keyS) this.keyW = true;
                    break;
                case "KeyS":
                    if (!this.keyW) this.keyS = true;
                    break;
            }
        };
        this.ctx.canvas.addEventListener("keydown", keyDownListener, false);
        this.listeners.keyDown = keyDownListener;

        // Key up listener
        const keyUpListener = e => {
            this.keyDown = false;
            switch (e.code) {
                case "KeyA":
                    this.keyA = false;
                    break;
                case "KeyD":
                    this.keyD = false;
                    break;
                case "KeyW":
                    this.keyW = false;
                    break;
                case "KeyS":
                    this.keyS = false;
                    break;
            }
        };
        this.ctx.canvas.addEventListener("keyup", keyUpListener, false);
        this.listeners.keyUp = keyUpListener;
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);

        // Rotate the canvas so it looks like the car is running forward
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        
        this.camera.draw(this.ctx);
    };

    update() {

        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        this.click = null;
    };

};

// KV Le was here :)