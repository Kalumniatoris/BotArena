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
    rspeed=Math.PI/180
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
    //this.va = Math.PI / 18;

    this.maxBullets = 10;
    this.bulletSpeed = 10;
    this.maxfireCooldown = 10;
    this.fireCooldown = 10;
    this.bulletDamage = 10;

    this.splitReady = false;
    this.splitCooldown = game.config.logicUpdate;
    this.maxSplitCooldown = game.config.logicUpdate;

    this.seeAngle = Math.PI / 5;
    this.seeDistance = 500;
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

    if (game.config.showViews) {
     game.buffer.push();
     game.buffer.stroke(255);
     let tc = [
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      20,
    ];
    game.buffer.fill(tc);
      game.buffer.line(0,0,1000,0)
      //game.buffer.fill(game.buffer.color(200,0,200,100));

     // game.buffer.text("AA",100,100);
      game.buffer.arc(0,0,this.seeDistance*2,this.seeDistance*2,-this.seeAngle,this.seeAngle,"pie")

      game.buffer.pop();

    }

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

    if (game.config.showViews) {
      let ay = this.y + this.seeDistance * Math.sin(this.angle - this.seeAngle);
      let ax = this.x + this.seeDistance * Math.cos(this.angle - this.seeAngle);

      let by = this.y + this.seeDistance * Math.sin(this.angle + this.seeAngle);
      let bx = this.x + this.seeDistance * Math.cos(this.angle + this.seeAngle);

      let tc = [
        this.color.levels[0],
        this.color.levels[1],
        this.color.levels[2],
        20,
      ];
      game.buffer.fill(tc);

      game.buffer.triangle(this.x, this.y, ax, ay, bx, by);
    }
  }

  step() {
    super.step();
    //  console.log(this.health);
    if (this.health <= 0) {
      //    console.log("killing");
      this.killMe(game.bots);
    }

    if (this.fireCooldown <= 0) {
      this.fireReady = true;
    }
    this.fireCooldown -= 1;

    if (this.splitCooldown <= 0) {
      this.splitReady = true;
    }
    this.splitCooldown -= 1;

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
        maxhealth: this.maxhealth,
        owner: this.owner,
        turnSpeed: this.rspeed,
      },
      { count: bc, max: this.maxBullets, speed: this.bulletSpeed,damage:this.bulletDamage },
      { height: game.buffer.height, width: game.buffer.width },
      this.see(game.bots)
    );

    console.log();
    let action;
    let param=null;
    if(typeof(s)=="string"){
      action=s;
    }
    else{
      action=s[0];
      param=s[1];
    }
    switch (action) {
      case "LEFT":
        if(param){               
        this.turnLeft(param);}
        else{this.turnLeft();}
        break;
      case "RIGHT":
        if(param){   
        this.turnRight(param);}
        else{this.turnRight();}
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
      case "SPLIT":
        this.split();

        break;
      case "SRIGHT":
        this.turnRight(Math.PI/360);
        break;
      case "SLEFT":
        this.turnLeft(Math.PI/360);
        break;
      case "HARM_ME":
        this.health -= this.maxhealth / 10;
        break;
      default:
        break;
    }
  }

  turnRight(va=this.rspeed) {
    va=Math.abs(va)>this.rspeed?this.rspeed:va;
  //  va=Math.abs(va)>this.rspeed?this.rspeed:va;
    this.angle += va;
  }
  turnLeft(va=this.rspeed) {
    
    va=Math.abs(va)>this.rspeed?this.rspeed:va;
  //    va=Math.abs(va)>this.rspeed?this.rspeed:va;
    this.angle -= va;
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
        let bullet = new Bullet(this);
        bullet.damage = this.bulletDamage;
        game.bullets.push(bullet);
      }
      this.fireReady = false;
      this.fireCooldown = this.maxfireCooldown;
    }
    // else{game.bullets.pop();}
  }

  killMe() {
    super.killMe(game.bots);
  }

  split() {
    if (!this.splitReady) {
      return;
    }
    this.splitCooldown = this.maxSplitCooldown;
    this.splitReady = false;
    this.maxhealth = Math.floor((this.maxhealth / 2) * 0.9 - 1);
    this.health = Math.floor((this.health / 2) * 0.9 - 1);

    var newBot = new Bot(
      this.x,
      this.y,
      this.size,
      this.color,
      this.ai,
      this.owner,
      this.maxhealth,
      this.speed,
      this.rspeed
    );

    newBot.size *= 0.9;
    this.size *= 0.9;
    newBot.bulletSize *= 0.7;
    this.bulletSize *= 0.7;
    this.bulletDamage *= 0.7;
    newBot.bulletDamage *= 0.7;
    this.maxBullets += 1;
    newBot.maxBullets += 1;

    game.bots.push(newBot);
  }

  see(things) {
    let ay = this.y + this.seeDistance * Math.sin(this.angle - this.seeAngle);
    let ax = this.x + this.seeDistance * Math.cos(this.angle - this.seeAngle);

    let by = this.y + this.seeDistance * Math.sin(this.angle + this.seeAngle);
    let bx = this.x + this.seeDistance * Math.cos(this.angle + this.seeAngle);
    let seen = [];
    // things.forEach((t) => {
    //   if (
    //     collidePointTriangle(t.x, t.y, this.x, this.y, ax, ay, bx, by) &&
    //     t != this
    //   ) {
    //     seen.push({
    //       owner: t.owner,
    //       health: t.health / t.maxhealth,
    //       distance: dist(t.x, t.y, this.x, this.y),
    //       angleTo: this.angleTo(t.x, t.y)*180/Math.PI,
    //       angle: t.angle - this.angle,
    //     });
    //   }
    // });

    for(let q=0;q<game.bots.length;q+=1){
      let dto=game.bots[q].distanceTo(this.x,this.y)
      if(dto<=this.seeDistance && game.bots[q]!=this){
        let ptarget=game.bots[q];

        let ato=this.angleTo(ptarget.x,ptarget.y);
        if(Math.abs(ato)<=this.seeAngle){
        seen.push({angleTo:ato,owner:ptarget.owner,health:ptarget.health,distance:dto});
      }
      }
    }
    this.seen = seen;
    return seen;
  }

  distanceTo(x,y){
    return dist(this.x,this.y,x,y)
  }
  angleTo(px, py) {/*
    let x2 = this.x + 1 * Math.cos(this.angle);
    let y2 = this.y + 1 * Math.sin(this.angle);
    // x1-=this.x;
    //  y1-=this.y;
    //return Math.atan2(y1 - y2, x1 - x2);*/

    
    var sx=10* Math.cos(this.angle);
    var sy=10* Math.sin(this.angle);

    var cx=px-this.x;
    var cy=py-this.y;

    var tma= (cx * sx + cy * sy) / (  Math.sqrt(cx*cx + cy*cy) *  Math.sqrt(sx*sx + sy*sy) );

    var angleTo=Math.acos(tma);

    if(!isLeft(this.x,this.y,this.x+100*Math.cos(this.angle),this.y+100*Math.sin(this.angle),px,py)){
      angleTo=-angleTo;
     // console.log(angleTo);
    }
    return angleTo;

  }
}
