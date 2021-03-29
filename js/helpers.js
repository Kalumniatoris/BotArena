var isLeft=function(Ax,Ay,Bx,By,X,Y){
    return  ((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))<0
  }






 var randomColor=function(){
      return [Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256)];
  }

  var dlog=function(x){
      if(game.debug.on){console.log(x);}
  }