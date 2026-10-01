(function(){
  function setSponsor(){
    const img=document.getElementById('home-sponsor-logo');
    if(!img||typeof data==='undefined'||!data||!Array.isArray(data.sponsors)) return false;
    const list=data.sponsors.filter(s=>s&&s.name);
    const official=list.find(s=>{
      const r=String(s.role||'').toLowerCase();
      return r.includes('oficial')||r.includes('principal');
    });
    if(official&&official.logo){
      img.src=official.logo;
      img.alt=official.name||'Patrocinador oficial';
    }
    return true;
  }
  window.lmUpdateHomeSponsor=setSponsor;
  document.addEventListener('DOMContentLoaded',function(){
    setSponsor();
    let tries=0;
    const timer=setInterval(function(){
      tries++;
      if(setSponsor()||tries>30) clearInterval(timer);
    },500);
  });
})();