class HUD {
    constructor(game, warrior) {
        Object.assign(this, { game, warrior });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hud.png");
        this.keySprite = ASSET_MANAGER.getAsset("./sprites/key.png");
        this.crystalSprite = ASSET_MANAGER.getAsset("./sprites/crystal.png");
        this.iconSprite = ASSET_MANAGER.getAsset("./sprites/icons.png");

        this.items = [];
        this.loadItems();
    }

    loadItems() {
        // useBtnY = PARAMS.CANVAS_HEIGHT - 85 * idx + 3
        // buyBtnY = PARAMS.CANVAS_HEIGHT - 85 * idx + 38

        // Health portion
        this.items.push({
            idx: 1,
            type: "Health Portion",
            description: ["Recover 50 HP."],
            number: this.warrior.healthPortion,
            cost: 2,
            frameX: 170,
            frameY: 68,
            frameW: 34,
            frameH: 34,
            image: this.iconSprite,
            btnX: PARAMS.CANVAS_WIDTH - 59,
            useBtnY: PARAMS.CANVAS_HEIGHT - 82,
            buyBtnY: PARAMS.CANVAS_HEIGHT - 47,
        });

        // Axe
        this.items.push({
            idx: 2,
            type: "Axe",
            description: 
                [
                    "Destroy breakable",
                    "wall near the warrior.",
                    "",
                    "*Breakable wall looks",
                    "slightly different from",
                    "the regular wall."
                ],
            number: this.warrior.axe,
            cost: 4,
            frameX: 204,
            frameY: 340,
            frameW: 34,
            frameH: 34,
            image: this.iconSprite,
            btnX: PARAMS.CANVAS_WIDTH - 59,
            useBtnY: PARAMS.CANVAS_HEIGHT - 167,
            buyBtnY: PARAMS.CANVAS_HEIGHT - 132,
        });
    }

    /**
     * Check if the player buy or use an item.
     */
    update() {
        if (this.game.click && this.game.click.x > this.items[0].btnX 
            && this.game.click.y > this.items[this.items.length - 1].useBtnY) {
            for (let i = 0; i < this.items.length; i++) {
                let it = this.items[i];
                if (this.game.click.y > it.useBtnY && this.game.click.y < it.useBtnY + 30 && it.number > 0) {
                    if (it.type === "Health Portion") {
                        this.warrior.health = Math.min(this.warrior.maxHealth, this.warrior.health + 50);
                        this.warrior.healthPortion--;
                        it.number = this.warrior.healthPortion;
                    }
                    else if (it.type === "Axe") {
                        // Check for breakable wall
                        this.warrior.axe--;
                        it.number = this.warrior.axe;
                    } 
                    break;
                } else if (this.game.click.y > it.buyBtnY && this.game.click.y < it.buyBtnY + 40 
                    && this.warrior.crystal >= it.cost) {
                    this.warrior.crystal -= it.cost;
                    if (it.type === "Health Portion") {
                        this.warrior.healthPortion++;
                        it.number = this.warrior.healthPortion;
                    }
                    else if (it.type === "Axe") {
                        // Check for breakable wall
                        this.warrior.axe++;
                        it.number = this.warrior.axe;
                    }
                    break;
                }
            }
            this.game.click = null;     // Prevent warrior from attack
        }
    }

    draw(ctx) {
        // Warrior status (top-left corner)

        // Frame
        ctx.drawImage(this.spritesheet, 16, 40, 31, 31, 0, 0, 50, 50);
        ctx.drawImage(this.spritesheet, 478, 80, 31, 31, 0, 49, 50, 50);
        for (let i = 0; i < 7; i++) ctx.drawImage(this.spritesheet, 49, 40, 31, 31, (i + 1) * 49, 0, 50, 50);
        for (let i = 0; i < 7; i++) ctx.drawImage(this.spritesheet, 511, 80, 31, 31, (i + 1) * 49, 49, 50, 50);
        ctx.drawImage(this.spritesheet, 82, 40, 31, 31, 8 * 49, 0, 50, 50);
        ctx.drawImage(this.spritesheet, 544, 80, 31, 31, 8 * 49, 49, 50, 50);

        // Status
        ctx.fillStyle = "white";
        ctx.font = "20px 'Rowdies'"

        // Health
        ctx.fillText("HP", 62 - ctx.measureText("HP").width, 30);
        // Bar
        ctx.drawImage(this.spritesheet, 259, 63, 23, 23, 65, 10, 23, 23);
        for (let i = 0; i < 13; i++)  ctx.drawImage(this.spritesheet, 284, 63, 23, 23, 87 + 22 * i, 10, 23, 23);
        ctx.drawImage(this.spritesheet, 308, 63, 23, 23, 87 + 22 * 13, 10, 23, 23);
        // Fill bar
        if (this.warrior.health > 0) ctx.drawImage(this.spritesheet, 428, 72, 7, 13, 70, 15, 7, 13);
        let perc = this.warrior.health  / this.warrior.maxHealth - 0.01;
        if (perc > 0.01) {
            let n = Math.ceil(52 * perc);
            for (let i = 0; i < n; i++) ctx.drawImage(this.spritesheet, 437, 72, 6, 13, 77 + i * 6, 15, 6, 13);
        }
        if (this.warrior.health == this.warrior.maxHealth) 
            ctx.drawImage(this.spritesheet, 445, 72, 7, 13, 99 + 22 * 13, 15, 7, 13);

        // Experience
        ctx.fillText("EXP", 62 - ctx.measureText("EXP").width, 57);
        // Bar
        ctx.drawImage(this.spritesheet, 259, 63, 23, 23, 65, 37, 23, 23);
        for (let i = 0; i < 13; i++)  ctx.drawImage(this.spritesheet, 284, 63, 23, 23, 87 + 22 * i, 37, 23, 23);
        ctx.drawImage(this.spritesheet, 308, 63, 23, 23, 87 + 22 * 13, 37, 23, 23);
        // Fill bar
        if (this.warrior.experience > 0) ctx.drawImage(this.spritesheet, 428, 56, 7, 13, 70, 42, 7, 13);
        perc = this.warrior.experience  / this.warrior.expToNextLevel - 0.01;
        if (perc > 0.01) {
            let n = Math.ceil(52 * perc);
            for (let i = 0; i < n; i++) ctx.drawImage(this.spritesheet, 437, 56, 6, 13, 77 + i * 6, 42, 6, 13);
        }
        if (this.warrior.experience == this.warrior.expToNextLevel) 
            ctx.drawImage(this.spritesheet, 445, 56, 7, 13, 99 + 22 * 13, 42, 7, 13);

        // Level
        ctx.fillText(`LV. ${this.warrior.level}`, 20, 84);

        // Attack
        ctx.fillText(`ATK: ${this.warrior.attack}`, 140, 84);

        // View
        ctx.fillText(`VIEW: ${this.warrior.view}`, 290, 84);


        // Tips (top-right corner)
        ctx.drawImage(this.spritesheet, 758, 444, 29, 17, PARAMS.CANVAS_WIDTH - 90, 10, 87, 51);
        if (this.game.mouse && this.game.mouse.x > PARAMS.CANVAS_WIDTH - 90 && this.game.mouse.y < 61) {
            this.drawFrame(ctx, PARAMS.CANVAS_WIDTH - 4 * 49 - 5, 80, 2, 5);
            ctx.fillStyle = "white";
            ctx.font = "25px 'Rowdies'"
            ctx.fillText("MOVE:", PARAMS.CANVAS_WIDTH - 180, 120);
            ctx.fillText("A - Left", PARAMS.CANVAS_WIDTH - 180, 160);
            ctx.fillText("D - Right", PARAMS.CANVAS_WIDTH - 180, 200);
            ctx.fillText("W - Up", PARAMS.CANVAS_WIDTH - 180, 240);
            ctx.fillText("S - Down", PARAMS.CANVAS_WIDTH - 180, 280);
            ctx.fillText("ATTACK:", PARAMS.CANVAS_WIDTH - 180, 360);
            ctx.fillText("Left click", PARAMS.CANVAS_WIDTH - 180, 400);
        }


        // Collections (bottom-left corner)
        ctx.fillStyle = "white";
        ctx.font = "25px 'Rowdies'"
        // Frame
        for (let i = 0; i < 2; i++) {
            ctx.drawImage(this.spritesheet, 16, 40, 31, 31, 5 + i * 125, PARAMS.CANVAS_HEIGHT - 65, 30, 30);
            ctx.drawImage(this.spritesheet, 478, 80, 31, 31, 5 + i * 125, PARAMS.CANVAS_HEIGHT - 35, 30, 30);
            ctx.drawImage(this.spritesheet, 49, 40, 31, 31, 35 + i * 125, PARAMS.CANVAS_HEIGHT - 65, 30, 30);
            ctx.drawImage(this.spritesheet, 511, 80, 31, 31, 35 + i * 125, PARAMS.CANVAS_HEIGHT - 35, 30, 30);
            ctx.drawImage(this.spritesheet, 49, 40, 31, 31, 65 + i * 125, PARAMS.CANVAS_HEIGHT - 65, 30, 30);
            ctx.drawImage(this.spritesheet, 511, 80, 31, 31, 65 + i * 125, PARAMS.CANVAS_HEIGHT - 35, 30, 30);
            ctx.drawImage(this.spritesheet, 82, 40, 31, 31, 95 + i * 125, PARAMS.CANVAS_HEIGHT - 65, 30, 30);
            ctx.drawImage(this.spritesheet, 544, 80, 31, 31, 95 + i * 125, PARAMS.CANVAS_HEIGHT - 35, 30, 30);
        }
        // Key
        ctx.drawImage(this.keySprite, 0, 0, 16, 16, 15, PARAMS.CANVAS_HEIGHT - 50, 32, 32);
        ctx.fillText(`${this.game.camera.keyCollected} / 5`, 55, PARAMS.CANVAS_HEIGHT - 25);
        // Crystal
        ctx.drawImage(this.crystalSprite, 81, 16, 13, 16, 145, PARAMS.CANVAS_HEIGHT - 50, 26, 32);
        ctx.fillText(this.warrior.crystal, 185, PARAMS.CANVAS_HEIGHT - 25);


        // Usable items (bottom-right corner)
        ctx.fillStyle = "white";
        ctx.font = "20px 'Rowdies'"
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            // Icon frames and icons
            ctx.drawImage(this.spritesheet, 16, 288, 53, 39, 
                PARAMS.CANVAS_WIDTH - 165, PARAMS.CANVAS_HEIGHT - 85 * it.idx, 106, 78);
            ctx.drawImage(it.image, it.frameX, it.frameY, it.frameW, it.frameH, 
                PARAMS.CANVAS_WIDTH - 125, PARAMS.CANVAS_HEIGHT - 85 * it.idx + 15, 50, 50);
            ctx.fillText(it.number, PARAMS.CANVAS_WIDTH - 125, PARAMS.CANVAS_HEIGHT - 85 * it.idx + 65);
            // Description frame
            if (this.game.mouse && this.game.mouse.x > PARAMS.CANVAS_WIDTH - 128 
                && this.game.mouse.x < PARAMS.CANVAS_WIDTH - 78
                && this.game.mouse.y > PARAMS.CANVAS_HEIGHT - 85 * it.idx + 15
                && this.game.mouse.y < PARAMS.CANVAS_HEIGHT - 85 * it.idx + 65) {
                let row = Math.ceil((it.description.length + 1) / 2);
                let x = PARAMS.CANVAS_WIDTH - 170 - 5 * 50;
                let y = PARAMS.CANVAS_HEIGHT - (row + 2) * 50 - 5;
                this.drawFrame(ctx, x, y, 3, row);
                x += 15;
                y += 50;
                ctx.fillText(`${it.type}:`, x, y);
                y += 40;
                for (let j = 0; j < it.description.length; j++, y+=30) ctx.fillText(it.description[j], x, y);
            }
            // Use
            ctx.font = "18px 'Rowdies'"
            if (it.number > 0) ctx.drawImage(this.spritesheet, 675, 54, 39, 26, it.btnX, it.useBtnY, 59, 30);
            else ctx.drawImage(this.spritesheet, 675, 84, 39, 26, it.btnX, it.useBtnY, 59, 30);
            ctx.fillText("USE", it.btnX + 9, it.useBtnY + 21);
            // Buy
            ctx.font = "20px 'Rowdies'"
            if (this.warrior.crystal >= it.cost) ctx.drawImage(this.spritesheet, 675, 54, 39, 26, it.btnX, it.buyBtnY, 59, 40);
            else ctx.drawImage(this.spritesheet, 675, 84, 39, 26, it.btnX, it.buyBtnY, 59, 40);
            ctx.drawImage(this.crystalSprite, 81, 16, 13, 16, it.btnX + 5, it.buyBtnY + 9, 20, 24);
            ctx.fillText(it.cost, it.btnX + 30, it.buyBtnY + 27);
        }
    }

    /**
     * Draw a UI frame on the canvas. If column or row is negative it will change the number to zero.
     * 
     * @param {*} ctx 
     * @param {number} x The x-coordinate of the top-left corner of the frame.
     * @param {number} y The y-coordinate of the top-left corner of the frame.
     * @param {number} col The number of columns of the frame, excluding the top and bottom border. Each column is 50px wide.
     * @param {number} row The number of rows of the frame, excluding the left and right border. Each row is 50px height.
     */
    drawFrame(ctx, x, y, col, row) {
        col = col > 0 ? col : 0;
        row = row > 0 ? row : 0;
        // left corners
        ctx.drawImage(this.spritesheet, 16, 40, 31, 31, x, y, 50, 50);
        ctx.drawImage(this.spritesheet, 478, 80, 31, 31, x, (row + 1) * 49 + y, 50, 50);
        // Top frame
        for (let i = 1; i < col + 1; i++) ctx.drawImage(this.spritesheet, 49, 40, 31, 31, x + i * 49, y, 50, 50);
        // Bottom frame
        for (let i = 1; i < col + 1; i++) ctx.drawImage(this.spritesheet, 511, 80, 31, 31, x + i * 49, 
            (row + 1) * 49 + y, 50, 50);
        // Left frame
        for (let i = 1; i < row + 1; i++) ctx.drawImage(this.spritesheet, 478, 24, 31, 31, x, i * 49 + y, 50, 50);
        // Right frame
        for (let i = 1; i < row + 1; i++) ctx.drawImage(this.spritesheet, 544, 24, 31, 31, x + (col + 1) * 49, 
            i * 49 + y, 50, 50);
        // Right corners
        ctx.drawImage(this.spritesheet, 82, 40, 31, 31, x + (col + 1) * 49, y, 50, 50);
        ctx.drawImage(this.spritesheet, 544, 80, 31, 31, x + (col + 1) * 49, (row + 1) * 49 + y, 50, 50);
        // Center frame
        for (let i = 1; i < col + 1; i++) 
            for (let j = 1; j < row + 1; j++) ctx.drawImage(this.spritesheet, 511, 24, 31, 31, 
                x + i * 49, j * 49 + y, 50, 50);
    }
}