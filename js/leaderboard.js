(() => {
const cfg=window.OT_CONFIG||{};
const localKey="operation-thesis-demo-scores";
async function save(result){
 if(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY){
   const response=await fetch(cfg.SUPABASE_URL+"/rest/v1/scores",{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.SUPABASE_ANON_KEY,"Prefer":"return=minimal"},body:JSON.stringify({nickname:result.nickname,score:result.score,elapsed_seconds:result.elapsed})});
   if(!response.ok)throw new Error("Controlla configurazione Supabase e policy RLS.");
 }else{
   const rows=JSON.parse(localStorage.getItem(localKey)||"[]");
   rows.push(result);localStorage.setItem(localKey,JSON.stringify(rows));
 }
}
async function getRows(){
 if(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY){
   const url=cfg.SUPABASE_URL+"/rest/v1/scores?select=nickname,score,elapsed_seconds,created_at&order=score.desc,elapsed_seconds.asc&limit=100";
   const r=await fetch(url,{headers:{"apikey":cfg.SUPABASE_ANON_KEY}});
   if(!r.ok)throw new Error("Classifica online non disponibile.");
   return (await r.json()).map(x=>({nickname:x.nickname,score:x.score,elapsed:x.elapsed_seconds}));
 }
 return JSON.parse(localStorage.getItem(localKey)||"[]").sort((a,b)=>b.score-a.score||a.elapsed-b.elapsed);
}
async function render(){
 const list=document.getElementById("leaderboardList");list.innerHTML="";
 try{
  const rows=await getRows();
  if(!rows.length){list.innerHTML='<p class="micro">Nessun risultato registrato.</p>';return}
  rows.forEach((r,i)=>{const row=document.createElement("div");row.className="rank-row";row.innerHTML=`<span class="rank-no">#${i+1}</span><div><div class="rank-name"></div><div class="rank-time"></div></div><strong class="rank-score"></strong>`;row.querySelector(".rank-name").textContent=r.nickname;row.querySelector(".rank-time").textContent=`TEMPO: ${r.elapsed}s`;row.querySelector(".rank-score").textContent=`${r.score}/100`;list.appendChild(row)});
 }catch(e){list.textContent=e.message}
}
window.OTLeaderboard={save,render};
})();