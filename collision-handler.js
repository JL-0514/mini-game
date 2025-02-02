class CollisionHandler {
    
    /**
     * Possible collisions:
     * 1. Warrior and wall, block the warrior.
     * 2. Warrior and attacking enemy or projectile, warrior get damaged.
     * 3. Warrior with crystal, collect crystal.
     * 4. Warrior with key, collect key.
     * 5. Warrior with chest, collect chest
     * 6. Warrior and teleport circle, finished the game.
     * 
     * 7. Enemy and wall, block the enemy.
     * 8. Enemy and warrior's blade, enemy get damaged.
     * 
     * 9. Projectile and wall, projectile remove from the world.
     * 10. Projectile and warrior's blade, projectile remove from the world.
     * 
     * @param {GameEngine} game The game engine
     * @param {*} entities List of entities
     */
    static handleCollision(game, entities) {
        let entitiesCount = entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let e1 = entities[i];

            if (e1 instanceof Floor || e1.removeFromWorld) continue;

            // Find warrior, enemy, and projectile since all collision happend between them
            if (!(e1 instanceof Warrior) && !(e1 instanceof Enemy) && !(e1 instanceof Projectile)) continue;

            for (let j = 0; j < entitiesCount; j++) {
                let e2 = entities[j];

                if (e2 instanceof Floor || e2.removeFromWorld) continue;

                // No collision happen between same type of entity.
                if (e1 instanceof Warrior && e2 instanceof Warrior
                    || e1 instanceof Enemy && e2 instanceof Enemy
                    || e1 instanceof Projectile && e2 instanceof Projectile
                ) continue;

                // Collision with warrior
                if (e1 instanceof Warrior) {
                    // 1
                    if ((e2 instanceof VerticalWall || e2 instanceof BreakableVerticalWall) 
                        && e1.BB.collide(e2.BB)) {
                        if (e1.BB.left > e2.BB.left && e1.BB.left < e2.BB.right && e1.direction == 1) {
                            e1.x += e1.BB.overlap(e2.BB).x;
                        }
                        else if (e1.BB.right > e2.BB.left && e1.BB.right < e2.BB.right && e1.direction == 0) {
                            e1.x -= e1.BB.overlap(e2.BB).x;
                        }
                    } else if ((e2 instanceof HorizontalWall || e2 instanceof BreakableHorizontalWall) 
                        && e1.BB.collide(e2.BB)) {
                        if (e1.BB.top > e2.BB.top && e1.BB.top < e2.BB.bottom) e1.y += e1.BB.overlap(e2.BB).y;
                        else if (e1.BB.bottom > e2.BB.top && e1.BB.bottom < e2.BB.bottom) e1.y -= e1.BB.overlap(e2.BB).y;
                    }
                    // 3
                    else if (e2 instanceof Crystal && e1.BB.collide(e2.BB)) {
                        e1.view += 15;
                        e1.experience += 10;
                        e1.health = Math.min(e1.maxHealth, e1.health + 5);
                        e2.removeFromWorld = true;
                    }
                    // 4
                    else if (e2 instanceof Key && e1.BB.collide(e2.BB)) {
                        e1.view += 30;
                        game.camera.keyCollected++;
                        e2.removeFromWorld = true;
                        if (game.camera.keyCollected == 5) 
                            game.addEntity(new Teleporter(game, 28 * PARAMS.BLOCK_SIZE, 42 * PARAMS.BLOCK_SIZE));
                    }
                    // 5
                    else if (e2 instanceof Chest && e1.BB.collide(e2.BB)) {
                        // TODO: Add if-statement to check if there's monster around the chest
                        e2.opened = true;
                        e1.upgradePoint++;
                    }
                    // 6
                    else if (e2 instanceof Teleporter && e1.BB.collide(e2.BB)) {
                        game.camera.state = 2;
                    }
                }
            }
        }
    }

}