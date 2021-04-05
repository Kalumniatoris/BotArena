class Variabler {
    data={};
    colnstructor(owner){
        this.owner=owner;
        //this.data={};
    }

   getVar(name){
       return this.data[name];
   }
   setVar(name,vari){
       this.data[name]=vari;
   }



}