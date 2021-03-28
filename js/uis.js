//game.cmCode

document.body.onload = () => {
  game.cmCode = CodeMirror($("#codeArea")[0], {
    value:
      'if(bot.speed<1){return "FASTER"}\n' +
      " if(seen.length>0){\n" +
      " let t=seen[0];\n" +
      " let at=t.angleTo;\n" +
      ' if(Math.abs(at)<0.01){return "FIRE"}\n' +
      ' if(at>0){return ["LEFT",at]} \n' +
      ' if(at<0){return ["LEFT",-at]} \n' +
      "}\n" +
      ' return "LEFT"',
    mode: "javascript",
    theme: "abcdef",
  });

  $("#codeSt")[0].textContent = game.functionSt;

  let btnPause = $("#btnPause")[0];
  btnPause.addEventListener("click", function () {
    if (game.logicPaused) {
      game.startLogic();
      btnPause.textContent = "Pause";
      btnPause.innerHTML =
        'Pause <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/> </svg>';
    } else {
      game.pauseLogic();
      btnPause.textContent = "Run";
    }
  });

  let btnKill = $("#btnKill")[0];
  btnKill.addEventListener("click", function () {
    game.bots = [];
  });

  let btnViews = $("#btnViews")[0];
  btnViews.addEventListener("click", function () {
    game.config.showViews = !game.config.showViews;
  });

  if (game.debug.on) {
    game.debug.bot1see = setInterval(() => {
      $("#t")[0].textContent =
        game.bots.length > 0 ? JSON.stringify(game.bots[0].seen) : "--";
    }, 100);
  }
};
