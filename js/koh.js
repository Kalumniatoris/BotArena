class Koh extends Entity {
  constructor(sx, sy, size, income) {
    super(sx, sy, 0, "GAME", size, randomColor(20));
    this.income = income;

    this.startTime = 100;
    this.time = 100;
  }

  giveExp(target) {
    target.addExp(this.income);
  }

  step() {
    this.time -= 1;
    if (this.time <= 0) {
      this.time = this.startTime;
      
      game.bots.forEach((bot) => {
        if (this.distanceTo(bot.x,bot.y) <= this.size) {
            this.giveExp(bot);
        }
      });
    }
  }


  draw(){
      game.buffer.fill(this.color);
      game.buffer.circle(this.x,this.y,this.size);
  }
}
