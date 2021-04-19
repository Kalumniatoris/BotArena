var isLeft = function (Ax, Ay, Bx, By, X, Y) {
    return ((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax)) < 0
}






var randomColor = function (a = 256) {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), a];
}

var dlog = function (x) {
    if (game.debug.on) { console.log(x); }
}

var autosaveDelay = 30;
var autoSaveCodes = setInterval(() => { saveValidCode(); saveAnyCode(); }, autosaveDelay * 1000);

function saveValidCode() {
    console.log("saving valid codes");
    if (checkCode(game.cmCode.getValue())) {
        validCodes[currentCode] = game.cmCode.getValue();

        window.localStorage.setItem("validCodes", JSON.stringify(validCodes));
        console.log("saving completed");
    }
    else {
        console.log("incorrect code, saving aborted")
    }
};

function saveAnyCode() {
    console.log("saving codes");

    codes[currentCode] = game.cmCode.getValue();

    window.localStorage.setItem("codes", JSON.stringify(codes));
    console.log("saving completed");

};
function loadCode(){
    if(window.localStorage.getItem("codes")!=null){

        codes=JSON.parse(window.localStorage.getItem("codes")).slice();
      }

      console.log(codes);
      game.cmCode.setValue(codes[0]);
}

function saveAll(){
    saveBots();
    saveAnyCode();
}
function loadAll(){
    loadCode();
    loadBots();
}

function saveBots() {
    window.localStorage.setItem("bots", JSON.stringify(game.bots));
}

function loadBots() {
    

    var tempbots = JSON.parse(window.localStorage.getItem("bots").slice());
    var tbl = [];
    tempbots.forEach((bot, id) => {
        tbl.push(new Bot());

        Object.entries(bot).forEach(([key, value]) => {
          //  console.log(key, value);
            tbl[id][key] = value
        });
        tbl[id].ai=generateFunction(tbl[id].aiString);
    });

    ////todo try to add separatell
   // game.bots = game.bots.slice();
    killAllBots();
    tbl.forEach((bot)=>{game.bots.push(bot)});
    //   game.bots=JSON.parse(window.localStorage.getItem("bots").slice());

}

function killAllBots() {
    game.bots.splice(0,game.bots.length);
  }