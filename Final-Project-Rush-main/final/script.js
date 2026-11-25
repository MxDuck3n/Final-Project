
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




const GAME_SCALE = 6;
const GAME_WIDTH = 272 * GAME_SCALE;
const GAME_HEIGHT = 160 * GAME_SCALE;
const PLAYER_SCALE = 2.5;
const PLAYER_HEIGHT = 32 * PLAYER_SCALE;
const SKELETON_SCALE = PLAYER_SCALE / 2;
const SKELETON_HEIGHT = 64 * SKELETON_SCALE;
const SKELETON_IDLE_FRAME = 7;

const config = {
     type: Phaser.AUTO,
     parent: "game-container",
     scale: {
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
     },
     pixelArt: true,
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

function createForestBackground(scene) {
     const keys = [
          "forest-back",
          "forest-lights",
          "forest-middle",
          "forest-front"
     ];

     keys.forEach((key) => {
          scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, key)
               .setOrigin(0.5)
               .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
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

    this.add.text(GAME_WIDTH / 2, 88 * GAME_SCALE, 'press arrow keys to jump and move, shift to dash', {
        font: `${10 * GAME_SCALE}px Arial`,
        fill: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, 116 * GAME_SCALE, 'press any key to start', {
        font: `${14 * GAME_SCALE}px Arial`,
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
     this.load.spritesheet("fumiko", "assets/parallax-forest/fumiko.png",
           {
                frameWidth: 24,
                frameHeight: 32
           });
     this.load.spritesheet("skeleton-Evil", "assets/skeleton-1.4/PNG/48x64_scale/skeleton-red_eyes-NESW.png", {
          frameWidth: 48,
          frameHeight: 64
     });
}


function scene2create() {
    createForestBackground(this);
    
    player = this.physics.add.sprite(GAME_WIDTH / 4, GAME_HEIGHT - PLAYER_HEIGHT / 2, "fumiko", 20);
    player.setScale(PLAYER_SCALE);
    player.body.setSize(20, 32);

    player.body.setCollideWorldBounds(true);

    this.add.sprite(GAME_WIDTH * 3 / 4, GAME_HEIGHT - SKELETON_HEIGHT / 2, "skeleton-Evil", SKELETON_IDLE_FRAME)
        .setScale(SKELETON_SCALE);

    this.physics.world.gravity.y = 250 * GAME_SCALE;

    cursors = this.input.keyboard.createCursorKeys();

    dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

}


function scene2update(time, delta) {
    
    player.body.setVelocityX(0);

    if (cursors.left.isDown) {
        facing = -1;
        player.body.setVelocityX(-62.5 * GAME_SCALE)
        player.flipX=true;

    } else if (cursors.right.isDown) {
        facing = 1;
        player.body.setVelocityX(62.5 * GAME_SCALE);
        player.flipX=false;
    }


    if (player.body.onFloor()) {
        jumpsUsed = 0;
    }


    if (Phaser.Input.Keyboard.JustDown(dashKey)) {
        dashTime = 200;
    }


    if (dashTime > 0) {
        player.body.setVelocityX(facing * 175 * GAME_SCALE);
        dashTime = Math.max(0, dashTime - delta);
    }


    if (Phaser.Input.Keyboard.JustDown(cursors.up) && jumpsUsed < 2) {
        player.body.setVelocityY(-137.5 * GAME_SCALE);
        jumpsUsed++;
    }


}





function scene3preload() {

}


function scene3create() {

}


function scene3update() {
    
}



