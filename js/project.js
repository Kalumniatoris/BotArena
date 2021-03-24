var game = {};

game.buffer;

game.config = {
  drawUpdate: 60,
  logicUpdate: 30,
};

game.functionSt= "function(bot,bullets,arena){";

game.bots = [];
game.bullets=[];
const ca = (p) => {
    p.setup = function () {
    var candiv = p.select("#arenaCanvas");

    p.createCanvas(candiv.width, 500);
    game.buffer = p.createGraphics(p.width, p.height);
    p.background(0);
      p.frameRate(game.config.drawUpdate);  
    setInterval(drawLoop, game.config.drawUpdate);

    setInterval(logicLoop, game.config.logicUpdate);

  
  };

  p.draw = function () {
    p.image(game.buffer, 0, 0);
  };

  p.mouseClicked = function () {
    if (
      p.mouseX > p.width ||
      p.mouseX < 0 ||
      p.mouseY > p.height ||
      p.mouseY < 0
    ) {
      return;
    }
    game.addBotWithCMAI(p.mouseX, p.mouseY, p);
  };
};

game.arenaCanvas = new p5(ca, "arenaCanvas");

function drawLoop() {
  game.buffer.background(0);
  game.bots.forEach((x) => x.draw());
  game.bullets.forEach((x) => x.draw());
}

function logicLoop() {
  game.bots.forEach((x) => x.step());
  game.bullets.forEach((x) => x.step());
}

game.addBotWithCMAI=function(x, y, p) {
  var newAi =
   game.functionSt +
    'let game="";\n' +
    game.cmCode.getValue() +
    "\n return -1;}";

  console.log(newAi.toString());

  let fun = new Function("return " + newAi)();

  console.log(fun);

  game.bots.push(
    new Bot(x, y, 20, p.color(p.random(256), p.random(256), p.random(256)), fun,"T"+Math.floor(Math.random()*100000000),100)
  );
}
