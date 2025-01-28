class CollisionHandler {
    
    static handleCollision(warrior, entities) {
        for (let i = 0; i < entities.length; i++) {
            if (entities[i] == warrior) continue;

            if (entities[i] instanceof Crystal && entities[i].BB.collide(warrior.BB)) {
                warrior.view += 5;
                warrior.experience += 10;
                warrior.health = Math.min(warrior.maxHealth, warrior.health + 5);
                entities[i].removeFromWorld = true;
            } else if (entities[i] instanceof Chest && entities[i].BB.collide(warrior.BB)) {
                // TODO: Add if-statement to check if there's monster around the chest
                entities[i].opened = true;
                warrior.upgradePoint++;
            }
        }
    }

}