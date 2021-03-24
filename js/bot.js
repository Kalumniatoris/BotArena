class Bot extends Entity {
  constructor(
    sx,
    sy,
    size,
    color,
    ai = () => {
      if (Math.random() < 0.5) {
        return "LEFT";
      } else {
        return "RIGHT";
      }
    },
    owner,
    maxhealth,
    speed,
    rspeed
  ) {
    //(sx,sy,sa,owner = "",maxhealth = 1,speed = 0,rspeed = 0,size = 100,color = 255)
    
    super(
      sx,
      sy,
      Math.random() * 2 * Math.PI,
      owner,
      maxhealth,
      speed,
      rspeed,
      size,
      color
    );

    this.ai = ai;
    this.maxSpeed = 10;
    this.speed = 0;
    this.acceleration = 1;
    this.va = Math.PI / 18;

    this.maxBullets = 10;
    this.bulletSpeed = 10;
    this.maxfireCooldown = 10;
    this.fireCooldown = 10;
  }

  draw() {
    game.buffer.translate(this.x, this.y);
    game.buffer.rotate(this.angle);
    game.buffer.fill(this.color);

    //game.buffer.circle(0,0,this.size);
    game.buffer.beginShape();
    game.buffer.vertex(-this.size / 2, -this.size / 2);
    game.buffer.vertex(-this.size / 2, this.size / 2);
    game.buffer.vertex(this.size / 2, 0);

    game.buffer.endShape();
    game.buffer.circle(this.size / 5, 0, this.size / 10);

    // game.buffer.rect(-5,-5,10,10);

    game.buffer.rotate(-this.angle);

    game.buffer.push();
    game.buffer.stroke(255);
    game.buffer.noFill();
    game.buffer.circle(0, 0, this.size);
    game.buffer.pop();

    //healthbar
    game.buffer.fill("red");
    game.buffer.rect(-this.size / 2, this.size, this.size, 5);

    game.buffer.fill("green");
    game.buffer.rect(
      -this.size / 2,
      this.size,
      (this.size * this.health) / this.maxhealth,
      5
    );
    //endhealthbar
    game.buffer.translate(-this.x, -this.y);
  }

  step() {
    super.step();
    if (this.health <= 0) {
      this.killMe(game.bots);
    }
    if (this.fireCooldown <= 0) {
      this.fireReady = true;
    }
    this.fireCooldown -= 1;
    this.border();
    this.forward();

    var bc = game.bullets.filter((x) => x.owner == this.owner).length;
    //if(bc>0){console.log(bc)}
    var s = this.ai(
      {
        x: this.x,
        y: this.y,
        speed: this.speed,
        angle: this.angle,
        health: this.health,
      },
      { count: bc, max: this.maxBullets },
      { height: game.buffer.height, width: game.buffer.width }
    );

    console.log();
    switch (s) {
      case "LEFT":
        this.turnLeft();
        break;
      case "RIGHT":
        this.turnRight();
        break;
      case "FASTER":
        this.faster();
        break;
      case "SLOWER":
        this.slower();
        break;
      case "FIRE":
      case "SHOOT":
        this.fire();
        break;
      case "HARM_ME":
        this.health -= this.maxhealth / 10;
        break;
      default:
        break;
    }
  }

  turnRight() {
    this.angle += this.va;
  }
  turnLeft() {
    this.angle -= this.va;
  }

  faster() {
    this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
  }

  //maximum reverse speed is half of forward one
  slower() {
    this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed / 2);
  }

  fire() {
    if (this.fireReady) {
      if (
        game.bullets.filter((b) => b.owner == this.owner).length <
        this.maxBullets
      ) {
        game.bullets.push(new Bullet(this));
      }
      this.fireReady = false;
      this.fireCooldown = this.maxfireCooldown;
    }
    // else{game.bullets.pop();}
  }

  killMe(){
    super.killMe(game.bots);
  }
}
