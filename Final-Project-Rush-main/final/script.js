
"use strict"




let scene1 = {
     key: "scene1",
     active: true,
     preload: scene1preload,
     create: scene1create,
     update: scene1update
};

let scene2 = {
     key: "scene2",
     active: false,
     preload: scene2preload,
     create: scene2create,
     update: scene2update
};

let scene3 = {
     key: "scene3",
     active: false,
     preload: scene3preload,
     create: scene3create,
     update: scene3update
};




const config = {
     type: Phaser.AUTO,
     parent: document.getElementById("game-container"),
     scale: {
          width: 1150,
          height: 650,
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
     },
     physics: {
          default: "arcade",
          arcade: {
               debug: true
          }
     },

     scene: [scene1, scene2, scene3]
}


const game = new Phaser.Game(config);

let player;
let cursors;
let dashKey;
let jumpsUsed;
let facing = 1;
let dashTime = 0;
let maxHealth = 100;
let health;
let healthText;
let invulnerableUntil = 0;
let isAlive = true;

function createForestBackground(scene) {
     const keys = [
          "forest-back",
          "forest-lights",
          "forest-middle",
          "forest-front"
     ];

     keys.forEach((key) => {
          scene.add.image(575, 325, key)
               .setOrigin(0.5)
               .setDisplaySize(1150, 650)
               .setDepth(-10);
     });
}


function scene1preload() {
     this.load.image("forest-back", "assets/parallax-forest/parallax-forest-back-trees.png");
     this.load.image("forest-lights", "assets/parallax-forest/parallax-forest-lights.png");
     this.load.image("forest-middle", "assets/parallax-forest/parallax-forest-middle-trees.png");
     this.load.image("forest-front", "assets/parallax-forest/parallax-forest-front-trees.png");
}


function scene1create() {

    this.cameras.main.setBackgroundColor("#000000");

    this.add.text(550, 390, 'press arrow keys to jump and move, shift to dash', {
        font: '24px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(550, 450, 'press any key to start', {
        font: '40px Arial',
        fill: '#ffffff'
        
    }).setOrigin(0.5)

     this.input.keyboard.once("keydown", () => {
          this.scene.start("scene2");
          }
     );

}


function scene1update() {

}




function scene2preload() {
     this.load.image("forest-back", "assets/parallax-forest/parallax-forest-back-trees.png");
     this.load.image("forest-lights", "assets/parallax-forest/parallax-forest-lights.png");
     this.load.image("forest-middle", "assets/parallax-forest/parallax-forest-middle-trees.png");
     this.load.image("forest-front", "assets/parallax-forest/parallax-forest-front-trees.png");

     this.load.spritesheet("fumiko", "assets/fumiko.png", {
          frameWidth: 24,
          frameHeight: 32
     });

      this.load.spritesheet("skeleton", "assets/skeleton.png", {
          frameWidth: 24,
          frameHeight: 32
     });

         this.load.spritesheet("items1", "assets/items1.png", {
          frameWidth: 32,
          frameHeight: 32
     });

}


function scene2create() {

    createForestBackground(this);
    
    player = this.physics.add.sprite(1150 / 2, 650 / 2, "fumiko", 20);

    player.body.setSize(20, 32);

    player.body.setCollideWorldBounds(true);

    this.physics.world.gravity.y = 1000;

    this.attackKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
);

    health = maxHealth;// The player's current health.

    invulnerableUntil = 0;// The time until which the player is invulnerable after taking damage.

    isAlive = true;// Whether the player is alive or dead.

    healthText = this.add.text(20, 20, "Health: " + health, {// Display the player's health on the screen.
        font: "24px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000"
    }).setScrollFactor(0).setDepth(20);

    const killPlayer = () => {

        isAlive = false;// Mark the player as dead.

        health = 0;// Set health to 0.

        healthText.setText("Health: 0");// Update the health display.

        this.scene.start("scene3");// Transition to the game over scene.

    };

    const damagePlayer = (amount) => {
        if (!isAlive || this.time.now < invulnerableUntil) {// If the player is dead or invulnerable, don't take damage.
            return;
        }

        health = Math.max(0, health - amount);// Decrease health but don't go below 0.

        healthText.setText("Health: " + health);// Update the health display.

        invulnerableUntil = this.time.now + 800;// Make the player invulnerable for 800 milliseconds.

        if (health === 0) {// If health reaches 0, kill the player.
            killPlayer();
            return;

     }
};

    
     this.enemyHealth = 100;// The enemy's current health.

     this.enemy = this.add.sprite(700, 632, "skeleton", 7);// Create the enemy sprite at position (800, 600) using the "skeleton" sprite sheet.
     
     this.physics.add.existing(this.enemy, true);// Add physics to the enemy and make it immovable.

     this.enemyHealthText = this.add.text(900, 20, "Enemy: " + this.enemyHealth, {// Display the enemy's health on the screen.
        font: "24px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000"
    }).setScrollFactor(0).setDepth(20);

     this.physics.add.overlap(player, this.enemy, () => {// When the player overlaps with the enemy, damage the player.
        damagePlayer(20);
    });

    cursors = this.input.keyboard.createCursorKeys();

    dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.input.keyboard.once("keydown-R", () => {// Restart the game when R is pressed.
        this.scene.start("scene1");
    });

}


function scene2update(time, delta) {

    if (!isAlive) {// If the player is dead, don't process input or movement.
        return;
    }
    
    player.body.setVelocityX(0);// Reset the player's horizontal velocity to 0 at the start of each update cycle.

    if (cursors.left.isDown) {// If the left arrow key is pressed, move the player to the left.

        facing = -1;// Set the facing direction to left.

        player.body.setVelocityX(-250)// Set the player's horizontal velocity to move left.

        player.flipX=true;// Flip the player sprite to face left when moving left.

    } else if (cursors.right.isDown) {// If the right arrow key is pressed, move the player to the right.

        facing = 1;// Set the facing direction to right.

        player.body.setVelocityX(250);// Set the player's horizontal velocity to move right.

        player.flipX=false;// Flip the player sprite to face right when moving right.

    }


    if (player.body.onFloor()) {// If the player is on the ground, reset the jump count.

        jumpsUsed = 0;// Reset the jump count when the player is on the ground.
    }


    if (Phaser.Input.Keyboard.JustDown(dashKey)) {// If the dash key is pressed, initiate a dash.

        dashTime = 200;// If the dash key is pressed, set the dash time to 200 milliseconds.
    }


    if (dashTime > 0) {
        player.body.setVelocityX(facing * 700);// If the player is dashing, set the velocity to a high value in the facing direction.

        dashTime = Math.max(0, dashTime - delta);// Decrease the dash time by the delta time, ensuring it doesn't go below 0.
    }


    if (Phaser.Input.Keyboard.JustDown(cursors.up) && jumpsUsed < 2) {// If the up arrow key is pressed and the player has jumps left, make the player jump.
        player.body.setVelocityY(-550);
        jumpsUsed++;
    }



    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {// If the attack key is pressed and the enemy is active, create a hitbox for the attack.

        const hitbox = this.add.rectangle(
            player.x + facing * 25,
            player.y,
            50,
            20,
            0x000000,
            0
        );// Create a rectangle hitbox in front of the player based on the facing direction.



        const swordOffsetY = -10;// Offset the sword hitbox slightly above the player's center for better alignment with the attack animation.

        const attackSprite = this.add.sprite(
          hitbox.x,
          hitbox.y + swordOffsetY,
          "items1",
          0
     ).setOrigin(0.5, 0.5);// Create a sprite for the attack animation at the hitbox's position using the "items1" sprite sheet.

        attackSprite.setFlipX(facing > 0).setScale(1);// Flip the attack sprite based on the facing direction and scale it up for better visibility.

        this.physics.add.existing(hitbox);// Add physics to the hitbox.

        hitbox.body.setAllowGravity(false);// Make the hitbox unaffected by gravity.

        hitbox.body.setImmovable(true);// Make the hitbox immovable so it doesn't get pushed by other objects.

        let didHit = false;// A flag to ensure the enemy is only hit once per attack.

        const attackOverlap = this.physics.add.overlap(hitbox, this.enemy, () => {// When the hitbox overlaps with the enemy, reduce the enemy's health.

            if (didHit || !this.enemy.active) {// If the enemy has already been hit or is inactive, do nothing.
                return;
            }

            didHit = true;// Set the flag to true to prevent multiple hits in one attack.

            this.enemyHealth = Math.max(0, this.enemyHealth - 10);// Reduce the enemy's health by 10 but don't go below 0.

            this.enemyHealthText.setText("Enemy: " + this.enemyHealth);// Update the enemy health text to reflect the new health value.

            if (this.enemyHealth === 0) {// If the enemy's health reaches 0, destroy the enemy and update the health text.

                this.enemy.destroy();// Destroy the enemy when its health reaches 0.

                this.enemyHealthText.setText("Enemy defeated");// Update the enemy health text to indicate the enemy is defeated.
            }
        }
     );

        this.time.delayedCall(100, () => {// After 100 milliseconds, destroy the overlap check and hitbox to limit the attack duration.

            attackOverlap.destroy();// Destroy the overlap check after 100 milliseconds to limit the attack duration.

            hitbox.destroy();// Destroy the hitbox after 100 milliseconds to limit the attack duration.

            attackSprite.destroy();// Destroy the attack sprite after 100 milliseconds to limit the attack duration.

               }
          );
     }
}





function scene3preload() {

}


function scene3create() {

    this.cameras.main.setBackgroundColor("#000000");// Set the background color of the scene to black.

    this.add.text(575, 285, "GAME OVER", {// Display a "GAME OVER" message in the center of the screen.
        font: "64px Arial",
        fill: "#ff0000"
    }).setOrigin(0.5);

    this.add.text(575, 355, "Press R to restart", {// Display a message prompting the player to restart the game.
        font: "24px Arial",
        fill: "#ffffff"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-R", () => {// Restart the game when R is pressed.
        this.scene.start("scene2");
    });
}


function scene3update() {
    
}



