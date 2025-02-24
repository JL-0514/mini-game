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
     * @param {number} framePadding Horizontal gap between each frame in the spritesheet.
     * @param {boolean} flip Whether the animation should be flip along y-axis.
     * @param {boolean} loop Whether the animation should be play in loop.
     * 
     * @property {number} elapsedTime Time it has been animated.
     * @property {number} totalTime Total time need for animation to play.
     */
    constructor(spritesheet, sCol, sRow, colCount, width, height, frameCount, frameDuration, framePadding, flip, loop) {
        Object.assign(this, { spritesheet, sCol, sRow, colCount, width, height, frameCount, frameDuration, framePadding, flip, loop });
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
    };

    drawFrame(tick, ctx, x, y, scale, shadow) {
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

        if (shadow) {
            let wx = shadow.owner.BB.x;
            let wy = shadow.owner.BB.y;
            let ww = shadow.owner.BB.width;
            let wh = shadow.owner.BB.height;

            for (let i = 0; i < shadow.length.length; i++) {
                ctx.save();
                ctx.filter = "blur(5px)";
                ctx.fillStyle = `rgba(0, 0, 0, 0.6)`;
                // Bound for shadow that cast on the wall
                let upperBound = 0;
                let lowerBound = shadow.lowerBound ? shadow.lowerBound - shadow.game.camera.y : PARAMS.CANVAS_HEIGHT;
                let leftBound = shadow.leftBound ? shadow.leftBound - shadow.game.camera.x : 0;
                let rightBound = shadow.rightBound ? shadow.rightBound - shadow.game.camera.x : PARAMS.CANVAS_WIDTH;
                // Ellipse
                let ex = wx + ww / 2 + Math.sin(shadow.angle[i]) * (shadow.length[i] / 2 + ww / 2);
                let ey = wy + wh - Math.cos(shadow.angle[i]) * (shadow.length[i] / 2 + ww / 2);
                let xr = 30;
                let yr = shadow.length[i] / 2 + ww;
                if (shadow.segment[i].length > 0) {
                    ctx.save();
                    ctx.beginPath();
                    let l = shadow.segment[i][1].line;
                    ctx.rect(l.points[0].x - shadow.game.camera.x, 
                        l.points[0].y - PARAMS.BLOCK_SIZE * 2 - shadow.game.camera.y, 
                        l.length(), PARAMS.BLOCK_SIZE * 2);
                    ctx.clip();
                    ctx.beginPath();
                    let r = xr * Math.max(1, 
                        Math.abs(shadow.angle[i] + (shadow.angle[i] >= 0 ? Math.PI / 2 : -Math.PI / 2)) / (Math.PI / 2));
                    ctx.ellipse(shadow.segment[i][0].x + (shadow.angle[i] >= 0 ? -r / 2 : r / 2) / 2 - shadow.game.camera.x, 
                        shadow.segment[i][1].y - shadow.game.camera.y, r, yr, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    upperBound = shadow.segment[i][0].y - shadow.game.camera.y;
                }
                ctx.beginPath();
                ctx.rect(leftBound, upperBound, rightBound - leftBound, lowerBound - upperBound);
                ctx.clip();
                ctx.beginPath();
                ctx.ellipse(ex - shadow.game.camera.x, ey - shadow.game.camera.y, xr, yr, shadow.angle[i], 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // for (let i = 0; i < shadow.length.length; i++) {
            //     let shadowCanvas = document.createElement("canvas");
            //     let shadowCtx = shadowCanvas.getContext("2d");
            //     shadowCanvas.width = shadow.length[i] * 2;
            //     shadowCanvas.height = shadowCanvas.width;
            //     shadowCtx.save();
            //     shadowCtx.globalAlpha = 0.7;
            //     shadowCtx.translate(shadowCanvas.width / 2, shadowCanvas.height / 2);
            //     shadowCtx.rotate(shadow.angle[i]);
            //     shadowCtx.translate(-shadowCanvas.width / 2, -shadowCanvas.height / 2);
            //     if (this.flip) {
            //         shadowCtx.scale(-1, 1);
            //         shadowCtx.drawImage(this.spritesheet,
            //             col * (this.width + this.framePadding), row * this.height,
            //             this.width, this.height,
            //             -shadowCanvas.width / 2 - this.width * scale / 2, 
            //             shadowCanvas.height / 2 - shadow.length[i],
            //             this.width * scale, shadow.length[i]);     
            //     } else {
            //         shadowCtx.drawImage(this.spritesheet,
            //             col * (this.width + this.framePadding), row * this.height,
            //             this.width, this.height,
            //             shadowCanvas.width / 2 - this.width * scale / 2, 
            //             shadowCanvas.height / 2 - shadow.length[i],
            //             this.width * scale, shadow.length[i]);
            //     }
            //     shadowCtx.restore();
            //     shadowCtx.strokeRect(0, 0, shadowCanvas.width, shadowCanvas.height);
            //     shadowCtx.globalCompositeOperation='source-atop';
            //     shadowCtx.fillStyle="rgb(20, 20, 20)";
            //     shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);

            //     // Rotate shadow
            //     ctx.fillRect(x + ww / 2 - shadowCanvas.width / 2 - shadow.game.camera.x, 
            //         wy + wh - shadowCanvas.height / 2 - shadow.game.camera.y, 
            //         shadowCanvas.width, shadowCanvas.height);
            //     ctx.drawImage(shadowCanvas, wx + ww / 2 - shadowCanvas.width / 2 - shadow.game.camera.x, 
            //         wy + wh - shadowCanvas.height / 2 - shadow.game.camera.y, 
            //         shadowCanvas.width, shadowCanvas.height);
            // }
        }
       
        if (this.flip) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.spritesheet,
                col * (this.width + this.framePadding), row * this.height,
                this.width, this.height,
                -x - this.width * scale, y,
                this.width * scale, this.height * scale);
            ctx.restore();
        } else {
            ctx.drawImage(this.spritesheet,
                col * (this.width + this.framePadding), row * this.height,
                this.width, this.height,
                x, y,
                this.width * scale, this.height * scale);
        }
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
}