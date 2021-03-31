var game = {};

game.buffer;

game.config = {
  drawUpdate: 60,
  logicUpdate: 30,
};
game.config.showViews=true;

game.logicPaused=true;
game.bots = [];
game.bullets=[];
game.kohs=[];
game.debug={};
game.debug.on=false;

const ca = (p) => {
    p.setup = function () {
    var candiv = p.select("#arenaCanvas");

    p.createCanvas(candiv.width, 500);
    game.buffer = p.createGraphics(p.width, p.height);
  //  p.background(0);
      p.frameRate(game.config.drawUpdate);  

 
   // gamesetInterval(drawLoop, game.config.drawUpdate);
  
    game.startDraw();
    game.startLogic();
    //setInterval(logicLoop, game.config.logicUpdate);

  
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
    addBotFromCode(p.mouseX,p.mouseY);
   // game.addBotWithCMAI(p.mouseX, p.mouseY, p);
  };
};

game.arenaCanvas = new p5(ca, "arenaCanvas");

game.drawLoop=function() {
  game.buffer.background(0);
  game.kohs.forEach((x) => x.draw());
  game.bots.forEach((x) => x.draw());
  game.bullets.forEach((x) => x.draw());
}


game.logicLoop=function() {
  
  game.bots.forEach((x) => x.step());
  game.bullets.forEach((x) => x.step());

  game.kohs.forEach((x) => x.step());
}




game.startLogic = function(){
  if(!game.logicPaused){return;}
  game.logic=setInterval(game.logicLoop, game.config.logicUpdate);
  game.logicPaused=false;
}

game.pauseLogic=function(){
  if(game.logicPaused){return;}
  clearInterval(game.logic);
  game.logicPaused=true;
}


game.startDraw = function(){
  console.log("startDraw");
  game.drawI=setInterval(game.drawLoop, game.config.drawUpdate);

}

game.pauseDraw=function(){
  clearInterval(game.drawI);
}


