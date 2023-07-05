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
  const { buffer } = game;
  const { x, y, angle, color, size, px, py } = this;

  buffer.push();
  buffer.translate(x, y);
  buffer.rotate(angle);
  buffer.fill(color);
  buffer.stroke(color);
  buffer.circle(0, 0, size);

  buffer.rotate(-angle);
  buffer.translate(-x, -y);

  buffer.push();
  buffer.strokeWeight(size);
  buffer.line(px, py, x, y);
  buffer.pop();
  buffer.pop();
}

step() {
  if (this.health <= 0) {
    this.killMe();
    return;
  }

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
    targets.forEach((target) => {
      if (collideLineCircle(this.x, this.y, this.px, this.py, target.x, target.y, target.size) && target.owner !== this.owner) {
        this.health -= 1;
        if (target.damage(this.damage) === 0) {
          this.shooter.addExp(Math.ceil(target.totalExperience / 2) + 1);
        }
        // Draw sparks at the collision point
        for (let i = 0; i < 10; i++) {
          const sparkX = this.x + Math.random() * 20 - 10;
          const sparkY = this.y + Math.random() * 20 - 10;
          const sparkAngle = Math.random() * 2 * Math.PI;
          const sparkSize = Math.random() * 2 + 1;
          const sparkColor = randomColor(255,45,60);
          const spark = new Spark(sparkX, sparkY, sparkAngle, sparkSize, sparkColor);
          spark.draw();
        }
      }
    });
  }
}

////////////////

class Spark {
  constructor(x, y, angle, size, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.size = size;
    this.color = color;
  }

  draw() {
    const { buffer } = game;
    buffer.push();
    buffer.translate(this.x, this.y);
    buffer.rotate(this.angle);
    buffer.fill(this.color);
    buffer.noStroke();
    buffer.circle(0, 0, this.size);
    buffer.pop();
  }
}