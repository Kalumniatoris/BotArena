class Variabler {
    data={};
    colnstructor(owner){
        this.owner=owner;
        //this.data={};
    }

   getVar(name){
       if(typeof(this.data[name])=="undefined"){return;}
       return this.data[name];
   }
   setVar(name,vari){
       this.data[name]=vari;
   }



}