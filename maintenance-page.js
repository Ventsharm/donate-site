'use strict';
const base='/donate-site/';
function safeReturn(){try{const u=new URL(new URLSearchParams(location.search).get('return')||base+'campaigns.html',location.origin);if(u.origin===location.origin&&u.pathname.startsWith(base)&&!u.pathname.endsWith('maintenance.html'))return u.href;}catch{}return base+'campaigns.html';}
let checking=false;
async function retry(){if(checking||document.hidden)return;checking=true;document.getElementById('retry').disabled=true;try{const r=await fetch('https://storage.googleapis.com/giftme-public-donate-app-ff07c/status.json',{cache:'no-cache',signal:AbortSignal.timeout(10000)});if(r.ok){const s=await r.json();if(s.maintenance===false&&Number.isFinite(s.updatedAt)&&Date.now()-s.updatedAt<20*60000){location.replace(safeReturn());return;}}document.getElementById('status').textContent='Still temporarily unavailable. Your account and saved campaign are retained.';}catch{document.getElementById('status').textContent='Could not reconnect yet. Please try again later.';}finally{checking=false;document.getElementById('retry').disabled=false;}}
document.getElementById('retry').onclick=retry;setInterval(retry,60000);
