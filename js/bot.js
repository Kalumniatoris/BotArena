class Entity{

    constructor(sx,sy,sa,owner="",maxhealth=1,speed=0,rspeed=0,size=100,color=255){
        this.sx=sx;
        this.sy=sy;
        this.sa=sa;
        //this.ai=ai;

        this.owner=owner;
        this.maxhealth=maxhealth;
        this.speed=speed;
        this.rspeed=rspeed; 
        this.size =size;
        this.color=color;

        this.x=sx;
        this.y=sy;
        this.angle=sa;
    }

    info(){
        console.log("Entity")
        console.log(this);
    }

    test(){console.log("test");}

    draw(){



    }

}


class Bot extends Entity{
    constructor(sx,sy,size,color,ai=()=>{if(Math.random()<0.5){return "LEFT";}else{return "RIGHT";}},owner,maxhealth,speed,rspeed){
        super(sx,sy,Math.random()*2*Math.PI,owner,maxhealth,speed,rspeed,size,color);

        this.ai=ai;
        this.maxSpeed=10;
        this.speed=0;
        this.acceleration=1;
        this.va=Math.PI/18;
    }


    draw(){
        game.buffer.translate(this.x,this.y);
        game.buffer.rotate(this.angle);
        game.buffer.fill(this.color);

        game.buffer.circle(0,0,this.size);
        game.buffer.circle(this.size/5,0,this.size/10);

       // game.buffer.rect(-5,-5,10,10);

        game.buffer.rotate(-this.angle);
        game.buffer.translate(-this.x,-this.y);
    }



    
    step(){
        this.border();
        this.forward();



        
        var s=this.ai({x:this.x,y:this.y,speed:this.speed,angle:this.angle,health:this.health});
        switch(s){
            case "LEFT":
            this.turnLeft();
            break;
            case "RIGHT":
            this.turnRight();
            break;
            case "FASTER":
            this.faster();
            break;
            case "SLOWER":
            this.slower();



            default:
            break;
        }



    }

    forward() {
        this.x = Math.max(this.x + this.speed * Math.cos(this.angle), 0)
        this.y = Math.max(this.y + this.speed * Math.sin(this.angle), 0)
      }


    turnRight(){this.angle+=this.va;}
    turnLeft(){this.angle-=this.va;}
    
    faster(){this.speed=Math.min(this.speed+this.acceleration,this.maxSpeed)}

    //maximum reverse speed is half of forward one
    slower(){this.speed=Math.max(this.speed-this.acceleration,-this.maxSpeed/2)}


    border() {
        if (this.x > game.buffer.width) {
          this.x = game.buffer.width;
        }
        if (this.y >  game.buffer.height - 10) {
          this.y = game.buffer.height - 10;
        }
        if (this.x <= 0) {
          this.x = 0;
        }
        if (this.y <= 0) {
          this.y = 0;
        }
      }
}