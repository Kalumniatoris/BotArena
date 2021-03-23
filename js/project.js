var game = {};

game.buffer;

game.config = {
  drawUpdate: 30,
  logicUpdate: 30,
};


game.bots = [];

const ca = (p) => {
  p.setup = function () {
    var candiv = p.select("#arenaCanvas");
    p.createCanvas(candiv.width, 500);
    game.buffer = p.createGraphics(p.width, p.height);
    p.background(0);

    setInterval(drawLoop, game.config.drawUpdate);

    setInterval(logicLoop, game.config.logicUpdate);

  
  };

  p.draw = function () {
    p.image(game.buffer, 0, 0);
    //  p.circle(p.mouseX,p.mouseY,100);
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
    addBot(p.mouseX, p.mouseY, p);
  };
};

let arenaCanvas = new p5(ca, "arenaCanvas");

function drawLoop() {
  game.buffer.background(0);
  game.bots.forEach((x) => x.draw());
}

function logicLoop() {
  game.bots.forEach((x) => x.step());
}

function addBot(x, y, p) {
  var newAi =
    "function(bot){" +
    'let game="";\n' +
    p.select("#code").value() +
    "\n return -1;}";

  console.log(newAi.toString());

  let fun = new Function("return " + newAi)();

  console.log(fun);

  game.bots.push(
    new Bot(x, y, 40, p.color(p.random(256), p.random(256), p.random(256)), fun)
  );
}
