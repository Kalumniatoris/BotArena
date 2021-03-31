game.upgrades = {};
game.upgrades.ratios = {
  health: 1,
  healing: 2,
  firerate: 2.5,
  speed: 2,
  bulletspeed: 1,
  sight: 0.2,
  damage: 2,
  bulletcount: 2
};

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
    owner
  ) {
    //(sx,sy,sa,owner = "",maxhealth = 1,speed = 0,rspeed = 0,size = 100,color = 255)

    super(sx, sy, Math.random() * 2 * Math.PI, owner, size, color);

    this.health = 100;
    this.maxhealth = 100;
    this.rspeed = Math.PI / 180;
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
    this.healRatio = 1;

    this.baseUpgradeCost = 10;

    this.upgradeCount = 0;
    //this.experience=0;
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
      let tc = [this.color[0], this.color[1], this.color[2], 20];
      game.buffer.fill(tc);
      game.buffer.line(0, 0, 1000, 0);
      //game.buffer.fill(game.buffer.color(200,0,200,100));

      // game.buffer.text("AA",100,100);
      game.buffer.arc(
        0,
        0,
        this.seeDistance * 2,
        this.seeDistance * 2,
        -this.seeAngle,
        this.seeAngle,
        "pie"
      );

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

      let tc = [this.color[0], this.color[1], this.color[2], 20];
      game.buffer.fill(tc);

      game.buffer.triangle(this.x, this.y, ax, ay, bx, by);
    }
  }

  step() {
    super.step();
    //  console.log(this.health);
    if (this.health <= 0 || this.maxhealth <= 0) {
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
        exp: this.experience,
        totalExp: this.totalExperience,
        experience:this.experience,
        totalExperience: this.totalExperience
      },
      {
        count: bc,
        max: this.maxBullets,
        speed: this.bulletSpeed,
        damage: this.bulletDamage,
      },
      { height: game.buffer.height, width: game.buffer.width },
      this.see(game.bots),
      this.upgradesCosts()
    );

    console.log();
    let action;
    let param = null;
    if (typeof s == "string") {
      action = s;
    } else {
      action = s[0];
      param = s[1];
    }

    action=action.toUpperCase();
    switch (action) {
      case "LEFT":
        if (param) {
          this.turnLeft(param);
        } else {
          this.turnLeft();
        }
        break;
      case "RIGHT":
        if (param) {
          this.turnRight(param);
        } else {
          this.turnRight();
        }
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

      case "UPGRADE":
        this.upgrade(param);
        break;
      case "HEAL":
        this.healByExp(param);
        break;
      case "HARM_ME":
        this.health -= this.maxhealth / 10;
        break;
      default:
        break;
    }
  }

  turnRight(va = this.rspeed) {
    va = Math.abs(va) > this.rspeed ? this.rspeed : va;
    //  va=Math.abs(va)>this.rspeed?this.rspeed:va;
    this.angle += va;
  }
  turnLeft(va = this.rspeed) {
    va = Math.abs(va) > this.rspeed ? this.rspeed : va;
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
        bullet.shooter = this;
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

    for (let q = 0; q < game.bots.length; q += 1) {
      let dto = game.bots[q].distanceTo(this.x, this.y);
      if (dto <= this.seeDistance && game.bots[q] != this) {
        let ptarget = game.bots[q];

        let ato = this.angleTo(ptarget.x, ptarget.y);
        if (Math.abs(ato) <= this.seeAngle) {
          seen.push({
            angleTo: ato,
            owner: ptarget.owner,
            health: ptarget.health,
            distance: dto,
          });
        }
      }
    }
    this.seen = seen;
    return seen;
  }


  angleTo(px, py) {
    /*
    let x2 = this.x + 1 * Math.cos(this.angle);
    let y2 = this.y + 1 * Math.sin(this.angle);
    // x1-=this.x;
    //  y1-=this.y;
    //return Math.atan2(y1 - y2, x1 - x2);*/

    var sx = 10 * Math.cos(this.angle);
    var sy = 10 * Math.sin(this.angle);

    var cx = px - this.x;
    var cy = py - this.y;

    var tma =
      (cx * sx + cy * sy) /
      (Math.sqrt(cx * cx + cy * cy) * Math.sqrt(sx * sx + sy * sy));

    var angleTo = Math.acos(tma);

    if (
      !isLeft(
        this.x,
        this.y,
        this.x + 100 * Math.cos(this.angle),
        this.y + 100 * Math.sin(this.angle),
        px,
        py
      )
    ) {
      angleTo = -angleTo;
      // console.log(angleTo);
    }
    return angleTo;
  }

  addExp(e) {
    this.experience += e;
    this.totalExperience += e;
  }

  healByExp(hp = this.experience) {
    // without parameters it uses all experience
    if (this.experience >= hp) {
      this.experience -= Math.abs(hp);
      this.health = Math.min(this.maxhealth, this.health + hp * this.healRatio);
    }
  }
  getExperience() {
    return this.experience;
  }
  addExperience(exp) {
    this.experience += exp;
  }

  getUpgradePrice(ucm) {
    return Math.ceil(ucm * this.baseUpgradeCost * (this.upgradeCount + 1));
  }

  upgrade(what) {
    let me = this;
    let price = 1e100;

    function canAfford(ucm) {
      return me.getExperience() >= me.getUpgradePrice(ucm);
    }
    function payForUpgrade(ucm) {
      me.addExperience(-me.getUpgradePrice(ucm));
      me.upgradeCount += 1;
    }
    what = what.toLowerCase();
    let p = 1;
    var upgraded=false;
    switch (what) {
      case "hp":
      case "health":
        p = game.upgrades.ratios.health;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);
            let rh = me.health / me.maxhealth;
            me.maxhealth *= 1.5;
            me.health = rh * me.maxhealth;
            upgraded=true;
          }
        }
        break;
      case "healing":
        p = game.upgrades.healing;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);
            me.healRatio = me.healRatio * 2 + 1;
            upgraded=true;
          }
        }
        break;
      case "damage":
        p = game.upgrades.ratios.damage;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);
            me.damage *= 1.5;
            upgraded=true;
          }
        }
        break;
      case "bulletcount":
        case "maxbullets":
        p = game.upgrades.ratios.bulletCount;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);

            me.maxBullets *= 1.5;
            upgraded=true;
          }
        }
        break;
      case "speed":
        p = game.upgrades.ratios.speed;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);

            me.maxSpeed *= 1.2;
            me.turnSpeed *= 1.5;
            upgraded=true;
          }
        }
        break;
      case "sight":
        p = game.upgrades.ratios.sight;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);

            me.seeAngle *= 1.2;
            me.seeDistance *= 1.2;
            upgraded=true;
          }
        }
        break;
      case "firerate":
        p = game.upgrades.ratios.firerate;
        if (canAfford(p)) {
          payForUpgrade(p);
          if (canAfford(p)) {
            payForUpgrade(p);
            me.maxfireCooldown *= 0.8;
            upgraded=true;
          }
        }
        break;
        case "bulletspeed":
          p = game.upgrades.ratios.bulletspeed;
          if (canAfford(p)) {
            payForUpgrade(p);
            if (canAfford(p)) {
              payForUpgrade(p);
              me.maxBullets = Math.Ceil(me.maxBullets*1.1+5);
              upgraded=true;
            }
          }
          break;
    }
    //maxhp
    //healing

    //bulletSpeed
    //bulletCount
    //bulletDamage
    if(upgraded){this.upgradeCount+=1;
    this.size*=1.1;
    }
    //this.experience-=upgradeCostMultiplier*this.upgradeCost;
  }

  upgradesCosts(){
    return {
      health: this.getUpgradePrice(game.upgrades.ratios.health),
      healing: this.getUpgradePrice(game.upgrades.ratios.healing),
      firerate: this.getUpgradePrice(game.upgrades.ratios.firerate),
      speed: this.getUpgradePrice(game.upgrades.ratios.speed),
      bulletspeed: this.getUpgradePrice(game.upgrades.ratios.bulletspeed),
      sight: this.getUpgradePrice(game.upgrades.ratios.sight),
      damage: this.getUpgradePrice(game.upgrades.ratios.damage),
      bulletcount: this.getUpgradePrice(game.upgrades.ratios.bulletcount)

    }

  }
}
