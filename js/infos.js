
document.body.onload = () => {
    let btnHideReturns=$("#btnHideReturns")[0];

    btnHideReturns.addEventListener("click", function () {
        $(".returns-collapse").each((i,e)=>{let tmp=new bootstrap.Collapse(e,{toggle:false});tmp.hide();})
        
      });


}