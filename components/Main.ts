import 'phaser';

export default class Main extends Phaser.Scene {
  create() {
    this.gameSpeed = 10;
    this.running = false;
    this.respawnTime = 0;

    const { height, width } = this.game.config;

    //You can zoom the camera with the line below.
    this.cameras.main.setZoom(1);
    //You can change this variable according to the amount you multiplied the sprite sizes by. I used 32x32 so just divide the sprite size you use by 32 and set the scale value to that.
    this.scale=1;

    this.jumpSound = this.sound.add("jump", {volume: .2});
    this.hitSound = this.sound.add("hit", {volume: .2});
    this.reachSound = this.sound.add("reach", {volume: .2});
    
    this.startTrigger = this.physics.add.sprite(0,300).setImmovable().setScale(this.scale);
    this.ground = this.add.tileSprite(0,height,88,26,"ground").setOrigin(0, 1).setScale(this.scale);
    this.dino = this.physics.add.sprite(0,height,"dino").setOrigin(0, 1).setCollideWorldBounds(true).setScale(this.scale*2.75).setGravityY(5000);

    this.height = height;
    this.width = width;
  
    this.gameOverScreen = this.add.group();
    this.gameOverText = this.add.image(width/2, height/2-50, "gameOver");
    this.restartBut = this.add.image(width/2, height/2+30, "restart").setInteractive();
    this.restartBut.on("pointerdown", () => {this.restart()});
    this.gameOverScreen.add(this.gameOverText);
    this.gameOverScreen.add(this.restartBut);
    this.gameOverScreen.setVisible(false);

    this.score=0;
    this.scoreText = this.add.text(width, 0, "00000", {fill: "#535353", font: "900 35px Courier", resolution: 5}).setOrigin(1,0).setVisible(false);
    if(localStorage.getItem("high") == undefined)
      localStorage.setItem("high", 0);

    this.highScore = localStorage.getItem("high");

    this.input.keyboard.on("keydown-SPACE", this.jump.bind(this));
    this.input.keyboard.on("keydown-W", this.jump.bind(this));
    this.input.keyboard.on("keydown-UP", this.jump.bind(this));
    this.input.keyboard.on("keydown-DOWN", this.crouch.bind(this));
    this.input.keyboard.on("keyup-DOWN", this.crouchRelease.bind(this));
    this.input.keyboard.on("keydown-S", this.crouch.bind(this));
    this.input.keyboard.on("keyup-S", this.crouchRelease.bind(this));

    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      this.startTrigger.destroy();

      const startEvent = this.time.addEvent({
        delay: 1000/60,
        callback:() =>{
          this.dino.setVelocityX(80);
          this.dino.play("dinoRun", true);

          if(this.ground.width < width)
            this.ground.width += 17*2;

          if(this.ground.width >= width){
            this.ground.width = width;
            this.running = true;
            this.dino.setVelocity(0);
            this.scoreText.setVisible(true);
            this.enviroment.setVisible(true);
            startEvent.remove();
          }
        }, loop: true
      });
    });

    this.obsticles = this.physics.add.group();

    this.physics.add.collider(this.obsticles, this.dino, () => {
      this.dino.x += 16;
      this.hitSound.play();
      this.physics.pause();
      this.running = false;
      this.anims.pauseAll();
      this.dino.play("dinoHurt");
      this.respawnTime = 0;
      this.gameSpeed = 10;
      this.gameOverScreen.setVisible(true);
    });
    
    this.enviroment = this.add.group();
    this.enviroment.addMultiple([
      this.add.image(width/2, 170, "cloud").setScale(this.scale),
      this.add.image(width-88, 80, "cloud").setScale(this.scale),
      this.add.image(width/1.3, 100, "cloud").setScale(this.scale),
    ]);
    this.enviroment.setVisible(false);
    this.enviroment.setDepth(-0.1);
    this.handleScore();
  }
  
  jump() {
    if(!this.running)
      this.restart();
    if(this.dino.body.onFloor()){
      this.dino.setVelocityY(-1600);
      this.jumpSound.play();
    }
  }

  crouch() {
    if(this.dino.body.onFloor()){
      this.dino.body.height = 55;
      this.dino.body.offset.y = 12;
    }
  }

  crouchRelease() {
    this.dino.body.height = 88;
    this.dino.body.offset.y = 0;
  }

  placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7);
    const distance = Phaser.Math.Between(600, 900);
    let obsticle;

    switch(obsticleNum) {
      case 0:
        const flightHeight = [60, 120, 180];
        obsticle = this.obsticles.create(this.width+distance, this.height-flightHeight[Math.floor(Math.random() * 3)], "pterodactyl").setScale(this.scale*2.75);
        obsticle.play("pterodactylFly", true);
        obsticle.body.height = obsticle.body.height/1.5;
        break;
      default:
        obsticle = this.obsticles.create(this.width+distance, this.height-48, "obsticle"+obsticleNum).setScale(this.scale);
    }
    obsticle.setImmovable();
  }

  handleScore(){
    this.time.addEvent({
      delay: 100,
      callback:() =>{
        if(this.running == true){
          this.gameSpeed += 0.01;
          this.score++;
          if(this.score%100 == 0){
            this.reachSound.play();
            this.time.addEvent({
              delay: 200,
              callback:() =>{
                if(this.scoreText.visible==true)
                  this.scoreText.visible=false;
                else
                  this.scoreText.visible=true;
              }, repeat: 5
            })
          }

          let scoreText = this.toFiveDigit(this.score);
          this.scoreText.setText("HI " + this.toFiveDigit(parseInt(this.highScore)) + " " + scoreText);
        }
      }, loop: true
    });
  }

  toFiveDigit(num){
    let numText = "";

    if(num/10000>=1)
      numText = ""+num;
    else if(num/1000>=1)
      numText = "0"+num;
    else if(num/100>=1)
      numText = "00"+num;
    else if(num/10>=1)
      numText = "000"+num;
    else
      numText = "0000"+num;

    return numText;
  }

  restart() {
    if(this.score>localStorage.getItem("high"))
        localStorage.setItem("high", this.score);
    this.highScore = this.toFiveDigit(localStorage.getItem("high"));
    this.dino.setVelocityY(0);
    this.dino.body.height=92;
    this.dino.body.offset.y=0;
    this.score=0;
    this.physics.resume();
    this.obsticles.clear(true, true);
    this.running = true;
    this.gameOverScreen.setVisible(false);
    this.anims.resumeAll();
  }

  update(time, delta) {
    if(!this.running)
      return;

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.enviroment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * .1;

    if(this.respawnTime >= 1500){
      this.placeObsticle();
      this.respawnTime = 0;
    };
    
    this.obsticles.getChildren().forEach(obsticle => {
      if(obsticle.getBounds().right < 0)
        obsticle.destroy();
    });

    this.enviroment.getChildren().forEach(cloud => {
      if(cloud.getBounds().right < 0)
        cloud.x = this.width + 30;
    });

    if(this.dino.body.deltaAbsY() > 0)
      this.dino.play("dinoIdle");
    else{
      if(this.dino.body.height<88)
        this.dino.play("dinoCrouch", true);
      else
        this.dino.play("dinoRun", true);
    }
  }
}
