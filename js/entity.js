class Entity {
  constructor(
    sx,
    sy,
    sa,
    owner = "",
    size = 100,
    color = 255
  ) {
    this.sx = sx;
    this.sy = sy;
    this.sa = sa;
    //this.ai=ai;

    this.owner = owner;

    this.size = size;
    this.color = color;


    //console.log("sx:",this.sx);
    this.x = this.sx;
    //console.log("x:",this.x);

    this.y = this.sy;
    this.px = this.x;
    this.py = this.y;
    this.angle = this.sa;

    this.bulletSize = 3;

    this.experience = 100;
    this.totalExperience = 100;


    dlog("created: ", this);
  }

  fixangle() {
    if (this.angle >= Math.PI) {
      this.angle -= 2 * Math.PI;
    }

    if (this.angle <= -Math.PI) {
      this.angle += 2 * Math.PI;
    }

    return this.angle;

  }


  info() {
    console.log("Entity", this);
  }

  draw() { }

  step() {
    this.fixangle();

  }

  border(mode = "border") {
    const isOutOfBounds = (this.x > game.buffer.width || this.x <= 0 || this.y > game.buffer.height || this.y <= 0);

    switch (mode) {
      case "damage":
        if (isOutOfBounds) {
          this.health -= this.maxhealth / 10;
        }
        break;

      case "kill":
        if (isOutOfBounds) {
          this.killMe();
        }
        break;

      default:
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
        break;
    }
  }

  forward() {
    const { x, y, speed, angle } = this;
    const newX = Math.max(x + speed * Math.cos(angle), 0);
    const newY = Math.max(y + speed * Math.sin(angle), 0);
    this.px = x;
    this.py = y;
    this.x = newX;
    this.y = newY;
  }

  killMe(array) {
    const index = array.indexOf(this);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  damage(amount) {
    this.health -= amount;
    return this.health <= 0 ? 0 : this.health;
  }

  distanceTo(x, y) {
    return dist(this.x, this.y, x, y);
  }
}
