import {getAuth} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
const endpoint='https://europe-west2-donate-app-ff07c.cloudfunctions.net/giftmeData';
export function getFirestore(app){return{app};}
export function doc(db,...parts){return{db,path:parts.join('/')};}
export function collection(db,...parts){return{db,path:parts.join('/'),filters:[]};}
export function where(field,op,value){return{filter:{field,op,value}};}
export function limit(count){return{limit:count};}
export function query(ref,...constraints){return{...ref,filters:constraints.filter(x=>x.filter).map(x=>x.filter),limit:constraints.find(x=>x.limit)?.limit};}
export function deleteField(){return{__giftmeDeleteField:true};}
async function request(ref,body){
  const user=getAuth(ref.db.app).currentUser;
  const headers={'Content-Type':'application/json'};
  if(user)headers.Authorization='Bearer '+await user.getIdToken();
  const response=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify({...body,path:ref.path}),signal:AbortSignal.timeout(20000)});
  const result=await response.json();
  if(result.code==='MAINTENANCE'){window.dispatchEvent(new Event('giftme-maintenance'));throw new Error('GiftMe is currently in maintenance.');}
  if(!response.ok){const err=new Error(result.error||'Data temporarily unavailable');err.code=response.status===404?'not-found':'permission-denied';throw err;}
  return result;
}
function snapshot(result){return{id:result.id,exists:()=>result.exists??true,data:()=>result.data};}
export async function getDoc(ref){return snapshot(await request(ref,{op:'get'}));}
export async function setDoc(ref,data,options={}){return request(ref,{op:'set',data,merge:options.merge===true});}
export async function updateDoc(ref,data){return request(ref,{op:'update',data});}
export async function deleteDoc(ref){return request(ref,{op:'delete'});}
export async function getDocs(ref){
  const docs=[];let after;
  do{
    const result=await request(ref,{op:'query',filters:ref.filters||[],limit:Math.min(ref.limit||100,100),after});
    docs.push(...result.docs.map(snapshot));after=ref.limit?null:result.next;
    if(docs.length>=1000&&after)throw new Error('Please narrow your campaign search.');
  }while(after);
  return{docs,size:docs.length,empty:docs.length===0,forEach:callback=>docs.forEach(callback)};
}
