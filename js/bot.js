class Entity {
  constructor(
    sx,
    sy,
    sa,
    owner = "",
    maxhealth = 1,
    speed = 0,
    rspeed = 0,
    size = 100,
    color = 255
  ) {
    this.sx = sx;
    this.sy = sy;
    this.sa = sa;
    //this.ai=ai;

    this.owner = owner;
    this.maxhealth = maxhealth;
    this.health = maxhealth;
    this.speed = speed;
    this.rspeed = rspeed;
    this.size = size;
    this.color = color;

    this.x = sx;
    this.y = sy;
    this.px = this.x;
    this.py = this.y;
    this.angle = sa;

    this.bulletSize = 3;
  }

  info() {
    console.log("Entity");
    console.log(this);
  }

  test() {
    console.log("test");
  }

  draw() {}

  border(mode = "border") {
    switch (mode){
      case "damage":{
        if( this.x > game.buffer.width ||
          this.x <= 0 ||
          this.y > game.buffer.height ||
          this.y <= 0){
            this.health-=this.maxhealth/10;
          }
      }
      break;
      case "kill":{
        if( this.x > game.buffer.width ||
          this.x <= 0 ||
          this.y > game.buffer.height ||
          this.y <= 0){
            this.killMe();
          }

      }
      break;
      default:
        {
          if (this.x > game.buffer.width) {
            this.x = game.buffer.width;
          }
          if (this.y > game.buffer.height) {
            this.y = game.buffer.height;
          }
          if (this.x <= 0) {
            this.x = 0;
          }
          if (this.y <= 0) {
            this.y = 0;
          }
        }
        break;
    }

  
  

  }

  forward() {
    this.px = this.x;
    this.py = this.y;
    this.x = Math.max(this.x + this.speed * Math.cos(this.angle), 0);
    this.y = Math.max(this.y + this.speed * Math.sin(this.angle), 0);
  }

  killMe(array) {
    let index = array.indexOf(this);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
}

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

class Bullet extends Entity {
  constructor(creator) {
    super(
      creator.x,
      creator.y,
      creator.angle,
      creator.owner,
      1,
      creator.bulletSpeed,
      0,
      creator.bulletSize,
      creator.color
    );
  }

  draw() {
    game.buffer.push();
    game.buffer.translate(this.x, this.y);
    game.buffer.rotate(this.angle);
    game.buffer.fill(this.color);
    game.buffer.stroke(this.color);
    game.buffer.circle(0, 0, this.size);

    game.buffer.rotate(-this.angle);
    game.buffer.translate(-this.x, -this.y);

    game.buffer.push();
    game.buffer.strokeWeight(this.size);

    game.buffer.line(this.px, this.py, this.x, this.y);
    game.buffer.pop();
    game.buffer.pop();
  }

  step() {
    this.forward();
    this.destroyAtBorder();
  }

  destroyAtBorder() {
    this.border("kill");
  }

  killMe(){
    super.killMe(game.bullets);
  }
}
