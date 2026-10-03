(() => {
  'use strict';
  const demo=location.pathname==='/donate-site/budget-demo.html';
  const endpoint='https://europe-west2-donate-app-ff07c.cloudfunctions.net/'+(demo?'giftmeMaintenanceDemoStatus':'giftmeMaintenanceStatus');
  let booted=false,checking=false;
  const style=document.createElement('style');
  style.textContent=`html[data-giftme-gate] body>*:not(#giftmeMaintenance){visibility:hidden!important}#giftmeMaintenance{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at top,#fff5e9,#faf8f5 65%,#fff);font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#352a24;visibility:visible!important}.gm-card{width:min(420px,100%);padding:38px 28px;text-align:center;border-radius:30px;background:#fff;border:1px solid #fff5e6;box-shadow:0 22px 65px #a76d2521}.gm-ring-wrap{position:relative;width:92px;height:92px;margin:0 auto 25px}.gm-glow{position:absolute;inset:8px;border-radius:50%;background:#ffac4770;filter:blur(18px);animation:gm-pulse 1.8s ease-in-out infinite}.gm-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#f59e0b,#ffe0a3,#fb923c,#f59e0b);animation:gm-spin 1.6s linear infinite}.gm-ring:before{content:'';position:absolute;inset:8px;border-radius:50%;background:white}.gm-sparkle{position:absolute;inset:0;display:grid;place-items:center;font-size:32px;color:#ef8a16;animation:gm-pulse 1.8s ease-in-out infinite}.gm-card h1{font-size:23px;line-height:1.25;margin:0 0 12px;font-weight:800}.gm-card p{font-size:15px;line-height:1.65;margin:0;color:#786d61}.gm-card strong{display:block;margin-top:6px}@keyframes gm-spin{to{transform:rotate(360deg)}}@keyframes gm-pulse{50%{transform:scale(1.09);opacity:.7}}@media(prefers-reduced-motion:reduce){.gm-ring,.gm-glow,.gm-sparkle{animation:none}}`;
  document.head.append(style);
  const overlay=document.createElement('main');
  overlay.id='giftmeMaintenance';
  overlay.setAttribute('role','status');
  function show(closed) {
    document.documentElement.dataset.giftmeGate=closed?'maintenance':'checking';
    overlay.innerHTML='<div class="gm-card"><div class="gm-ring-wrap" aria-hidden="true"><div class="gm-glow"></div><div class="gm-ring"></div><div class="gm-sparkle">✦</div></div><h1>'+(closed?'GiftMe is taking a little break 🧡':'Opening GiftMe…')+'</h1><p>'+(closed?'We’re currently carrying out some maintenance.<strong>GiftMe will be back online soon.</strong>':'Getting everything ready…')+'</p></div>';
    if(!overlay.isConnected) document.body.append(overlay);
  }
  async function boot() {
    booted=true;
    delete document.documentElement.dataset.giftmeGate;
    overlay.remove();
    for(const old of document.querySelectorAll('script[type="application/giftme-script"]')) {
      const script=document.createElement('script');
      for(const attr of old.attributes) if(attr.name!=='type' && attr.name!=='data-giftme-type') script.setAttribute(attr.name,attr.value);
      const originalType=old.dataset.giftmeType;
      if(originalType) script.type=originalType;
      script.textContent=old.textContent;
      if(!script.src && originalType==='module') {
        const ready='giftme-module-ready-'+crypto.randomUUID();
        script.textContent+='\n;window.dispatchEvent(new Event('+JSON.stringify(ready)+'));';
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>{window.removeEventListener(ready,done);reject(new Error('App startup unavailable'));},30000);
          function done(){clearTimeout(timer);resolve();}
          window.addEventListener(ready,done,{once:true});
          old.replaceWith(script);
        });
      } else if(script.src) {
        await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;old.replaceWith(script);});
      } else old.replaceWith(script);
    }
    // Re-dispatch load for existing app loaders after delayed startup.
    window.dispatchEvent(new Event('load'));
  }
  async function check() {
    if(checking) return;
    checking=true;
    try {
      const response=await fetch(endpoint,{cache:'no-store',signal:AbortSignal.timeout(10000)});
      if(!response.ok) throw new Error('Status unavailable');
      const status=await response.json();
      if(typeof status.maintenance!=='boolean') throw new Error('Invalid status');
      if(status.maintenance) {
        show(true);
        // Reload stops listeners and in-flight application code. On the new
        // document only the maintenance checker runs until reopening.
        if(booted) location.reload();
      } else if(!booted) await boot();
    } catch (_) {
      show(true);
      if(booted) location.reload();
    } finally {checking=false;}
  }
  show(false);
  check();
  setInterval(check,60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden) check();});
  window.addEventListener('online',check);
})();
