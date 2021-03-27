var isLeft=function(Ax,Ay,Bx,By,X,Y){
    return  ((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))<0
  }


  var checkCode=function(code){
    code=code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
    code=code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,'').trim();
    code=code.replace(/[^{}()[]+/g,'').trim();
    console.log(code)

    var cl=code.length; 
    //c{ s[ r(
    var c=0,s=0,r=0;

    for(var i=0;i<cl;i+=1){
        switch(code[i]){
            case "(":
                r+=1;
                break;
            case "{":
                c+=1;
                break;
            case "[":
                s+=1;
                break;
            case ")":
                r-=1;
                break;
            case "}":
                c-=1;
                break;
            case "]":
                s-=1;
                break;
            default:
                break;
            }
            if(c<0||r<0||s<0){return false}

    }
    if(c!=0||r!=0||s!=0){return false}

    return true;

    
  }