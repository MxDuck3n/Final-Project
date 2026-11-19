
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
     this.load.spritesheet("fumiko", "assets/parallax-forest/fumiko.png", {
          frameWidth: 24,
          frameHeight: 32
     });
}


function scene2create() {
    createForestBackground(this);
    
    player = this.physics.add.sprite(1150 / 2, 650 / 2, "fumiko", 20);
    player.body.setSize(20, 32);

    player.body.setCollideWorldBounds(true);

    this.physics.world.gravity.y = 1000;

    cursors = this.input.keyboard.createCursorKeys();

    dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

}


function scene2update(time, delta) {
    
    player.body.setVelocityX(0);

    if (cursors.left.isDown) {
        facing = -1;
        player.body.setVelocityX(-250)
        player.flipX=true;

    } else if (cursors.right.isDown) {
        facing = 1;
        player.body.setVelocityX(250);
        player.flipX=false;
    }


    if (player.body.onFloor()) {
        jumpsUsed = 0;
    }


    if (Phaser.Input.Keyboard.JustDown(dashKey)) {
        dashTime = 200;
    }


    if (dashTime > 0) {
        player.body.setVelocityX(facing * 700);
        dashTime = Math.max(0, dashTime - delta);
    }


    if (Phaser.Input.Keyboard.JustDown(cursors.up) && jumpsUsed < 2) {
        player.body.setVelocityY(-550);
        jumpsUsed++;
    }


}





function scene3preload() {

}


function scene3create() {

}


function scene3update() {
    
}



