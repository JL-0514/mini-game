class CollisionHandler {
    
    /**
     * Possible collisions:
     * 1. Warrior and wall, block the warrior.
     * 2. Warrior and attacking enemy or projectile, warrior get damaged.
     * 3. Warrior and projectile, warrior get damaged, projectile disappear.
     * 4. Warrior with crystal, collect crystal.
     * 5. Warrior with key, collect key.
     * 6. Warrior with chest, collect chest
     * 7. Warrior and teleport circle, finished the game.
     * 
     * 8. Enemy and wall, enemy turn around.
     * 9. Enemy and warrior's blade, enemy get damaged.
     * 
     * 10. Projectile and wall, projectile remove from the world.
     * 11. Projectile and warrior's blade, projectile remove from the world.
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
                    if (e2 instanceof Wall && e1.BB.collide(e2.BB)) {
                        let o = e1.BB.overlap(e2.BB);
                        if (o.x < o.y) {    // Overlap from left or right
                            if (e1.BB.left > e2.BB.left && e1.BB.left < e2.BB.right && e1.direction == 1)
                                e1.x += o.x;
                            else if (e1.BB.right > e2.BB.left && e1.BB.right < e2.BB.right && e1.direction == 0)
                                e1.x -= o.x;
                        } else {    // Overlap from top or bottom
                            if (e1.BB.top > e2.BB.top && e1.BB.top < e2.BB.bottom) e1.y += o.y;
                            else e1.y -= o.y;
                        }
                    }
                    // 2 
                    else if (e2 instanceof Enemy && e2.state == 1 && e1.state < 3 && !e1.noDamage
                        && e1.BB.collide(e2.BB)) {
                        e1.health -= e2.attack;
                        if (e1.state < 2) e1.state = 3;
                    }
                    // 3
                    else if ( e2 instanceof Projectile && !(e1.state == 3) && e1.BB.collide(e2.BB)) {
                        
                    }
                    // 4
                    else if (e2 instanceof Crystal && e1.BB.collide(e2.BB)) {
                        e1.view += 15;
                        e1.experience += 10;
                        e1.crystal++;
                        e1.health = Math.min(e1.maxHealth, e1.health + 5);
                        e2.removeFromWorld = true;
                    }
                    // 5
                    else if (e2 instanceof Key && e1.BB.collide(e2.BB)) {
                        e1.view += 30;
                        game.camera.keyCollected++;
                        e2.removeFromWorld = true;
                        if (game.camera.keyCollected == 5)  // Create exit for the maze
                            game.addEntity(new Teleporter(game, 28 * PARAMS.BLOCK_SIZE, 42 * PARAMS.BLOCK_SIZE));
                    }
                    // 6
                    else if (e2 instanceof Chest && !e2.opened && e2.enemy == 0 && e1.BB.collide(e2.BB)) {
                        e2.opened = true;
                        e1.upgradePoint++;
                        e1.view += 10;
                    }
                    // 7
                    else if (e2 instanceof Teleporter && e1.BB.collide(e2.BB)) {
                        game.camera.state = 2;
                    }
                } 
                // Collision with enemy
                else if (e1 instanceof Enemy) {
                    // 8
                    if (e2 instanceof Wall && e1.BB.collide(e2.BB)) {
                        e1.direction = (e1.direction + 1) % 2;
                    }
                    // 9
                    else if (e2 instanceof Blade && e1.BB.collide(e2.BB)) {
                        e1.dealAttack(e2.warrior.attack);
                    } 
                }
            }
        }
    }

}