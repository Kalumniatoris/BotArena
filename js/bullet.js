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
  