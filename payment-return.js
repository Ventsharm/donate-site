'use strict';
const uid=new URLSearchParams(location.search).get('c');
if(uid&&/^[A-Za-z0-9_-]{1,128}$/.test(uid))document.getElementById('back').href='donate.html?c='+encodeURIComponent(uid);
