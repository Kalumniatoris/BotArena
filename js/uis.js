var cmCode

document.body.onload=()=>{
  cmCode=CodeMirror($("#codeArea")[0],{
    value:   
                'if(bot.speed<5){return "FASTER";}\n'+
                'if(bot.x<200 && bot.angle>0){return "LEFT";}\n'+
                'if(bot.x>500 && bot.angle<Math.PI){return "RIGHT";}\n'+

    
                'if(bot.y<200){return "LEFT";}\n'+
                'if(bot.y>400){return "RIGHT";}\n'+
                'return "FIRE";'
                ,
                

                mode:  "javascript",
                theme: "abcdef"


  })
  

  $("#codeSt")[0].innerText=game.functionSt;
}