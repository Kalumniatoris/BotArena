game.functionSt = "function(bot,bullets,arena,seen,costs,v){";
var currentCode=0;
var checkCode = function (code) {
  code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();
  code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, "").trim();
  code = code.replace(/[^{}()\][]+/g, "").trim();
  console.log(code);

  var cl = code.length;
  //c{ s[ r(
  var c = 0,
    s = 0,
    r = 0;

  for (var i = 0; i < cl; i += 1) {
    switch (code[i]) {
      case "(":
        r += 1;
        break;
      case "{":
        c += 1;
        break;
      case "[":
        s += 1;
        break;
      case ")":
        r -= 1;
        break;
      case "}":
        c -= 1;
        break;
      case "]":
        s -= 1;
        break;
      default:
        break;
    }
    if (c < 0 || r < 0 || s < 0) {
      return false;
    }
  }
  if (c != 0 || r != 0 || s != 0) {
    return false;
  }

  return true;
};

var addBot = function (x, y, ai, owner = "A" + Date.now() + Math.floor(Math.random() * 1000000)) {
  let newBot = new Bot(x, y, 20, randomColor(), ai, owner);

  game.bots.push(newBot);


}

var addBotFromCode = function (x, y, owner) {
  if (!checkCode(game.cmCode.getValue())) {
    console.log("failed simple brackets test");
    return;
  }


  var newAi =
    game.functionSt + "/*" + game + "*/" +
    'v.setVar(bot.owner,new Variabler(bot.owner));v=v.getVar(bot.owner);let game="";  \n' +
    game.cmCode.getValue() +
    "\n return \"WAIT\" ;}";

  let fun = new Function("return " + newAi)();

  addBot(x, y, fun, owner);
};



