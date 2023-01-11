import 'phaser';

export default class Preloader extends Phaser.Scene {
  preload() {
    console.log("loading...");
    
    this.load.audio("jump", "./assets/jump.m4a");
    this.load.audio("hit", "./assets/hit.m4a");
    this.load.audio("reach", "./assets/reach.m4a");

    this.load.image("ground", "./assets/ground.png");
    this.load.image("cloud", "./assets/cloud.png");
    this.load.image("restart", "./assets/restart.png");
    this.load.image("gameOver", "./assets/gameOver.png");
    this.load.image("obsticle1", "./assets/cactusesBig1.png");
    this.load.image("obsticle2", "./assets/cactusesBig2.png");
    this.load.image("obsticle3", "./assets/cactusesBig3.png");
    this.load.image("obsticle4", "./assets/cactusesSmall1.png");
    this.load.image("obsticle5", "./assets/cactusesSmall2.png");
    this.load.image("obsticle6", "./assets/cactusesSmall3.png");


    this.load.atlas("dino", "./assets/dino.png", "./assets/dino.json");
    this.load.atlas("moon", "./assets/moon.png", "./assets/moon.json");
    this.load.atlas("star", "./assets/star.png", "./assets/star.json");
    this.load.atlas("pterodactyl", "./assets/pterodactyl.png", "./assets/pterodactyl.json");
  }
  create() {
    //Animations
    this.anims.create({
      key: "dinoIdle",
      frameRate: 0,
      frames: this.anims.generateFrameNames("dino", {prefix: "dino ", suffix: ".ase", start: 0, end: 0, zeroPad: 1}),
      repeat: -1
    });

    this.anims.create({
      key: "dinoRun",
      frameRate: 10,
      frames: this.anims.generateFrameNames("dino", {prefix: "dino ", suffix: ".ase", start: 1, end: 2, zeroPad: 1}),
      repeat: -1
    });

    this.anims.create({
      key: "dinoHurt",
      frameRate: 0,
      frames: this.anims.generateFrameNames("dino", {prefix: "dino ", suffix: ".ase", start: 3, end: 3, zeroPad: 1}),
      repeat: -1
    });

    this.anims.create({
      key: "dinoCrouch",
      frameRate: 10,
      frames: this.anims.generateFrameNames("dino", {prefix: "dino ", suffix: ".ase", start: 4, end: 5, zeroPad: 1}),
      repeat: -1
    });

    this.anims.create({
      key: "pterodactylFly",
      frameRate: 2,
      frames: this.anims.generateFrameNames("pterodactyl", {prefix: "Pterodactyl ", suffix: ".ase", start: 0, end: 1, zeroPad: 1}),
      repeat: -1
    });
    
    this.scene.start("main");
  }
  update() {
  }
}
