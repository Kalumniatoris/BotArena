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
        
        this.velocity=0;
        this.va=Math.PI/18;
    }


    draw(){
        buffer.translate(this.x,this.y);
        buffer.rotate(this.angle);
        buffer.fill(this.color);

        buffer.circle(0,0,this.size);
        buffer.circle(this.size/5,0,this.size/10);

       // buffer.rect(-5,-5,10,10);

        buffer.rotate(-this.angle);
        buffer.translate(-this.x,-this.y);
    }



    
    step(){
        var s=this.ai({x:this.x,y:this.y},this.a);
        switch(s){
            case "LEFT":
            this.turnLeft();
            break;
            case "RIGHT":
            this.turnRight();
            break;

            default:
            break;
        }

    }

    turnRight(){this.angle-=this.va;}
    turnLeft(){this.angle+=this.va;}


}