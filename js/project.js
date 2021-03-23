var buffer;

var config = {
  drawUpdate: 30,
  logicUpdate: 30,
};

var bots = [];
const ca = (p) => {
  p.setup = function () {
    var candiv = p.select("#arenaCanvas");
    p.createCanvas(candiv.width, 500);
    buffer = p.createGraphics(p.width, p.height);
    p.background(0);

    setInterval(drawLoop, config.drawUpdate);

    setInterval(logicLoop, config.logicUpdate);

    bots.push(
      new Bot(
        300,
        100,
        50,
        p.color(p.random(256), p.random(256), p.random(256))
      )
    );
  };

  p.draw = function () {
    p.image(buffer, 0, 0);
    //  p.circle(p.mouseX,p.mouseY,100);
  };

  p.mouseClicked = function () {
    var newAi = "function(pos,x){" + p.select("#code").value() + "\n return -1;}";

    console.log(newAi);

    let fun=new Function("return "+newAi)()

    console.log(fun);


    bots.push(
      new Bot(
        p.mouseX,
        p.mouseY,
        40,
        p.color(p.random(256), p.random(256), p.random(256)),
        fun
      )
    );
  };


  
};

let arenaCanvas = new p5(ca, "arenaCanvas");

function drawLoop() {
  buffer.background(0);
  bots.forEach((x) => x.draw());
}

function logicLoop() {
  bots.forEach((x) => x.step());
}
