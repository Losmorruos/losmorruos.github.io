(function(){
  const FG_LOGO = "./logo-fg-automocion-alargado.svg";
  function setSponsor(){
    const img=document.getElementById("home-sponsor-logo");
    if(!img) return false;
    // El banner superior debe mostrar SIEMPRE el logo horizontal de FG Automoción.
    // No permitimos que los datos dinámicos/localStorage lo sustituyan por el logo antiguo.
    if(img.getAttribute("src") !== FG_LOGO) img.setAttribute("src", FG_LOGO);
    img.alt="FG Automoción";
    img.style.display="block";
    return true;
  }
  window.lmUpdateHomeSponsor=setSponsor;
  function lockSponsor(){
    setSponsor();
    const img=document.getElementById("home-sponsor-logo");
    if(img && !img.__lmObserver){
      const observer=new MutationObserver(function(){ setSponsor(); });
      observer.observe(img,{attributes:true,attributeFilter:["src","style"]});
      img.__lmObserver=observer;
    }
  }
  document.addEventListener("DOMContentLoaded",function(){
    lockSponsor();
    let tries=0;
    const timer=setInterval(function(){
      tries++;
      lockSponsor();
      if(tries>20) clearInterval(timer);
    },500);
  });
})();