class Entity {
    constructor(
      sx,
      sy,
      sa,
      owner = "",
      size = 100,
      color = 255
    ) {
      this.sx = sx;
      this.sy = sy;
      this.sa = sa;
      //this.ai=ai;
  
      this.owner = owner;
     
      this.size = size;
      this.color = color;


      console.log("sx:",this.sx);
      this.x = this.sx;
      console.log("x:",this.x);

      this.y = this.sy;
      this.px = this.x;
      this.py = this.y;
      this.angle = this.sa;
  
      this.bulletSize = 3;

      this.experience=100;
      this.totalExperience=100;

      
    console.log("created: ",this);
    }

    fixangle(){
        if(this.angle>=Math.PI){
            this.angle-=2*Math.PI;
        }

        if(this.angle<=-Math.PI){
            this.angle+=2*Math.PI;
        }

        return this.angle;

    }
    

    info() {
      console.log("Entity");
      console.log(this);
    }
  
    test() {
      console.log("test");
    }
  
    draw() {}

    step() {this.fixangle();
    
    }

    border(mode = "border") {
      switch (mode){
        case "damage":{
          if( this.x > game.buffer.width ||
            this.x <= 0 ||
            this.y > game.buffer.height ||
            this.y <= 0){
              this.health-=this.maxhealth/10;
            }
        }
        break;
        case "kill":{
          if( this.x > game.buffer.width ||
            this.x <= 0 ||
            this.y > game.buffer.height ||
            this.y <= 0){
              this.killMe();
            }
  
        }
        break;
        default:
          {
            if (this.x > game.buffer.width) {
              this.x = game.buffer.width;
            }
            if (this.y > game.buffer.height) {
              this.y = game.buffer.height;
            }
            if (this.x <= 0) {
              this.x = 0;
            }
            if (this.y <= 0) {
              this.y = 0;
            }
          }
          break;
      }
  
    
    
  
    }
  
    forward() {
      this.px = this.x;
      this.py = this.y;
      this.x = Math.max(this.x + this.speed * Math.cos(this.angle), 0);
      this.y = Math.max(this.y + this.speed * Math.sin(this.angle), 0);
    }
  
    killMe(array) {
      let index = array.indexOf(this);
      if (index > -1) {
        array.splice(index, 1);
      }
    }

    damage(amount){
        this.health-=amount;
        if(this.health<=0){return 0;}
        else {return this.health;}
    }
  }
  