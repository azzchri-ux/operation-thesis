(() => {
const questions = [
 {c:"PASSWORD SECURITY",q:"Quale caratteristica rende una password più resistente agli attacchi?",a:["Usare il proprio nome e l'anno di nascita","Riutilizzare una password facile da ricordare","Usare una passphrase lunga e unica","Cambiare solo una lettera ogni mese"],ok:2},
 {c:"PHISHING",q:"Ricevi un'email urgente dalla banca con un link per sbloccare il conto. Cosa fai?",a:["Clicco subito per evitare il blocco","Rispondo chiedendo conferma","Apro il link da un altro dispositivo","Non clicco e verifico tramite canali ufficiali"],ok:3},
 {c:"PUBLIC WI-FI",q:"Qual è una buona precauzione quando usi una rete Wi-Fi pubblica?",a:["Disattivare ogni aggiornamento","Evitare operazioni sensibili e usare connessioni protette","Condividere la rete con chiunque","Usare sempre la stessa password"],ok:1},
 {c:"MULTI-FACTOR AUTHENTICATION",q:"A cosa serve l'autenticazione a più fattori (MFA)?",a:["A sostituire ogni aggiornamento","A rendere più veloce il Wi-Fi","Ad aggiungere una verifica oltre alla password","A condividere l'account"],ok:2},
 {c:"RANSOMWARE",q:"Che cosa fa tipicamente un ransomware?",a:["Cifra o blocca i dati chiedendo un riscatto","Migliora le prestazioni del PC","Aggiorna automaticamente il sistema","Filtra la posta indesiderata"],ok:0},
 {c:"HTTPS",q:"Che cosa indica principalmente HTTPS?",a:["Che il sito è sicuramente onesto","Che il sito non contiene malware","Che la connessione tra browser e sito è cifrata e autenticata","Che il sito appartiene a un ente pubblico"],ok:2},
 {c:"BACKUP",q:"Quale strategia aiuta a recuperare i dati dopo un incidente?",a:["Tenere una sola copia sul PC","Fare backup periodici e conservarne copie separate","Inviare i file a sé stessi via chat","Rinominare spesso le cartelle"],ok:1},
 {c:"SOFTWARE UPDATE",q:"Perché è importante installare gli aggiornamenti di sicurezza?",a:["Per eliminare ogni rischio informatico","Per correggere vulnerabilità note","Per rendere pubblici i file","Per evitare di usare antivirus"],ok:1},
 {c:"OTP & SOCIAL ENGINEERING",q:"Una persona al telefono ti chiede il codice OTP appena ricevuto. Cosa fai?",a:["Lo comunico se conosce il mio nome","Lo invio solo via SMS","Non lo condivido e verifico la richiesta tramite canali ufficiali","Lo pubblico nella chat aziendale"],ok:2},
 {c:"SAFE BROWSING",q:"Un collega ti invia un link inatteso da un account che sembra autentico. Qual è la scelta più prudente?",a:["Aprirlo perché conosco il mittente","Verificare il contesto con il collega attraverso un altro canale","Inserire le credenziali per vedere dove porta","Inoltrarlo a tutto il gruppo"],ok:1}
];
let index=0, score=0, startedAt=0, nickname="";
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0)}
function render(){
 const q=questions[index];
 $("counter").textContent=String(index+1).padStart(2,"0");
 $("progressFill").style.width=((index+1)/15*100)+"%";
 $("category").textContent=q.c;$("questionText").textContent=q.q;
 $("scoreLive").textContent="PUNTEGGIO: "+String(score).padStart(3,"0");
 const labels=["A","B","C","D"];
 $("answers").innerHTML="";
 q.a.forEach((answer,i)=>{const b=document.createElement("button");b.className="answer";b.innerHTML=`<span>${labels[i]}</span><div></div>`;b.querySelector("div").textContent=answer;b.addEventListener("click",()=>choose(i));$("answers").appendChild(b)});
}
function choose(choice){
 [...$("answers").children].forEach(b=>b.disabled=true);
 if(choice===questions[index].ok)score+=10;
 $("scoreLive").textContent="PUNTEGGIO: "+String(score).padStart(3,"0");
 setTimeout(()=>{
   index++;
   if(index===10){$("finalScore").textContent=score+"/100";show("incident");window.OTEffects?.startIncident(()=>show("reveal"));}
   else render();
 },450);
}
$("startBtn").addEventListener("click",()=>{
 nickname=$("nickname").value.trim().replace(/\s+/g," ");
 if(nickname.length<2){$("nickname").focus();$("nickname").setCustomValidity("Inserisci un nickname di almeno 2 caratteri.");$("nickname").reportValidity();return}
 $("nickname").setCustomValidity("");startedAt=Date.now();index=0;score=0;show("quiz");render();
});
$("nickname").addEventListener("input",()=>$("nickname").setCustomValidity(""));
$("submitBtn").addEventListener("click",async()=>{
 if(!$("silenceCheck").checked){$("submitStatus").textContent="Conferma il Protocollo Silenzio per proseguire.";return}
 $("submitBtn").disabled=true;$("submitStatus").textContent="Registrazione risultato...";
 const result={nickname,score,elapsed:Math.max(1,Math.round((Date.now()-startedAt)/1000)),createdAt:new Date().toISOString()};
 try{await window.OTLeaderboard.save(result);$("submitStatus").textContent="Risultato registrato.";show("leaderboard");await window.OTLeaderboard.render();}
 catch(e){$("submitStatus").textContent="Impossibile registrare online. "+e.message;$("submitBtn").disabled=false;}
});
$("retryBtn").addEventListener("click",()=>{ $("submitBtn").disabled=false;$("silenceCheck").checked=false;$("submitStatus").textContent="";$("nickname").value="";show("intro");});
window.OTQuiz={getQuestions:()=>questions};
})();