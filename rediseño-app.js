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

/*
 * Ajuste exclusivo para escritorio:
 * compacta la franja fija de patrocinador/colaboradores sin tocar el diseño móvil.
 */
(function(){
  function applyDesktopSponsorCompact(){
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    const bar = document.getElementById("sponsor-footer");
    if(!bar) return;

    if(!desktop){
      // No modificar el formato móvil.
      return;
    }

    const set = (el, prop, value) => {
      if(el) el.style.setProperty(prop, value, "important");
    };

    set(bar, "position", "fixed");
    set(bar, "left", "0");
    set(bar, "right", "0");
    set(bar, "bottom", "0");
    set(bar, "width", "100%");
    set(bar, "height", "112px");
    set(bar, "min-height", "112px");
    set(bar, "max-height", "112px");
    set(bar, "padding", "5px 14px");
    set(bar, "gap", "12px");
    set(bar, "overflow", "hidden");

    const mainSponsor = bar.querySelector(".sf-main-sponsor");
    const collaborators = bar.querySelector(".sf-collaborators");
    set(mainSponsor, "flex", "0 0 32%");
    set(mainSponsor, "padding-right", "12px");
    set(collaborators, "flex", "1 1 68%");

    bar.querySelectorAll(".sf-heading").forEach(el => {
      set(el, "font-size", "10px");
      set(el, "margin-bottom", "4px");
    });

    const featured = bar.querySelector(".sf-featured-logo");
    set(featured, "height", "78px");
    set(featured, "min-height", "78px");
    set(featured, "max-height", "78px");
    set(featured, "flex", "0 0 78px");

    const featuredImg = bar.querySelector(".sf-featured-logo img");
    set(featuredImg, "height", "100%");
    set(featuredImg, "min-height", "0");
    set(featuredImg, "max-height", "100%");
    set(featuredImg, "object-fit", "contain");
    set(featuredImg, "transform", "none");

    const collabLogos = bar.querySelector(".sf-collab-logos");
    set(collabLogos, "gap", "8px");

    bar.querySelectorAll(".sf-static-logo").forEach(el => {
      set(el, "height", "64px");
      set(el, "min-height", "64px");
      set(el, "max-height", "64px");
    });

    bar.querySelectorAll(".sf-static-logo img").forEach(el => {
      set(el, "height", "100%");
      set(el, "min-height", "0");
      set(el, "max-height", "100%");
      set(el, "object-fit", "contain");
      set(el, "transform", "none");
    });

    document.body.classList.add("has-sponsor-footer");
    const main = document.querySelector("body.has-sponsor-footer main");
    set(main, "padding-bottom", "128px");
  }

  function start(){
    applyDesktopSponsorCompact();
    const bar = document.getElementById("sponsor-footer");
    if(bar && !bar.__lmDesktopCompactObserver){
      const observer = new MutationObserver(function(){
        applyDesktopSponsorCompact();
      });
      observer.observe(bar, {childList:true, subtree:true});
      bar.__lmDesktopCompactObserver = observer;
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start, {once:true});
  } else {
    start();
  }

  window.addEventListener("resize", applyDesktopSponsorCompact);
})();
