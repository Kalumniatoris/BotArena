var codes = [
  'if(bot.speed<1){return "FASTER"}\n' +
    " if(seen.length>0){\n" +
    " let t=seen[0];\n" +
    " let at=t.angleTo;\n" +
    ' if(Math.abs(at)<0.01){return "FIRE"}\n' +
    ' if(at>0){return ["LEFT",at]} \n' +
    ' if(at<0){return ["LEFT",-at]} \n' +
    "}\n"+
    ' return "LEFT"'
];
var validCodes= [
  'if(bot.speed<1){return "FASTER"}\n' +
    " if(seen.length>0){\n" +
    " let t=seen[0];\n" +
    " let at=t.angleTo;\n" +
    ' if(Math.abs(at)<0.01){return "FIRE"}\n' +
    ' if(at>0){return ["LEFT",at]} \n' +
    ' if(at<0){return ["LEFT",-at]} \n' +
    "}\n"+
    ' return "LEFT"'
];