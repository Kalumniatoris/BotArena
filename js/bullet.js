class Bullet extends Entity {
  
  constructor(creator) {
    super(
      creator.x,
      creator.y,
      creator.angle,
      creator.owner,
      creator.bulletSize,
      creator.color
    );
    this.shooter=creator;
    this.damage=creator.bulletDamage;  
    this.speed=creator.bulletSpeed;


     dlog("B ,"+this);
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
    if(this.health<=0){this.killMe();return;}

    this.forward();
    this.checkCollisions(game.bots);
    this.destroyAtBorder();
  }

  destroyAtBorder() {
    this.border("kill");
  }

  killMe() {
    super.killMe(game.bullets);
  }

  checkCollisions(targets) {
    //targets = game.bots (potential targets)
    let collided = [];
    targets.forEach((t) => {
      if (
        collideLineCircle(this.x, this.y, this.px, this.py, t.x, t.y, t.size) && t.owner!=this.owner
      ) {
            this.health-=1;

            if(t.damage(this.damage)==0){this.shooter.addExp(t.totalExperience/2)};
            //if(t.health)
        //collided.push(t);
      }
    });
  }
}
