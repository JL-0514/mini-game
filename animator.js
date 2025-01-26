class Animator {
    /**
     * Create an animator for an entity to do an animation for a certain action.
     * 
     * @param {*} spritesheet The spritesheet of the entity.
     * @param {number} sCol Index of column the first frame is placed. The index start at zero.
     * @param {number} sRow Index of row the first frame is placed. The index start at zero
     * @param {number} colCount How many columns the sprite sheet has.
     * @param {number} width Width of a frame.
     * @param {number} height Height of a frame.
     * @param {number} frameCount Total number of frames in this animation.
     * @param {number} frameDuration How long a frame last before move to next frame.
     * @param {boolean} reverse Whether it should flip the animation.
     * @param {boolean} loop Whether the animation should be play in loop.
     * 
     * @property {number} elapsedTime Time it has been animated.
     * @property {number} totalTime Total time need for animation to play.
     */
    constructor(spritesheet, sCol, sRow, colCount, width, height, frameCount, frameDuration, flip, loop) {
        Object.assign(this, { spritesheet, sCol, sRow, colCount, width, height, frameCount, frameDuration, flip, loop });
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        let col = (this.sCol + frame) % this.colCount;
        let row = this.sRow + Math.floor((this.sCol + frame) / this.colCount);
       
        if (this.flip) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.spritesheet,
                col * this.width, row * this.height,
                this.width, this.height,
                -x - this.width * scale, y,
                this.width * scale,
                this.height * scale);
            ctx.restore();
        } else {
            ctx.drawImage(this.spritesheet,
                col * this.width, row * this.height,
                this.width, this.height,
                x, y,
                this.width * scale,
                this.height * scale);
        }
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
}