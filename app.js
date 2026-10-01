const FLOWQUEST_TOTAL_XP = 600;
let flowState = JSON.parse(localStorage.getItem('flowquestMultiPage') || '{"done":[],"xp":0,"completedAt":null}');
if(!Array.isArray(flowState.done)) flowState.done=[];
if(typeof flowState.xp!=='number') flowState.xp=0;

function fqRank(){
  if(flowState.xp>=600) return 'Flowchart Master';
  if(flowState.xp>=400) return 'Algorithm Agent';
  if(flowState.xp>=200) return 'Bug Hunter';
  return 'Rookie Coder';
}
function fqSave(){ localStorage.setItem('flowquestMultiPage', JSON.stringify(flowState)); fqRender(); }
function fqRender(){
  const xpText=document.getElementById('xpText');
  const xpFill=document.getElementById('xpFill');
  if(xpText) xpText.textContent=`${flowState.xp} / ${FLOWQUEST_TOTAL_XP} XP`;
  if(xpFill) xpFill.style.width=`${Math.min(100,(flowState.xp/FLOWQUEST_TOTAL_XP)*100)}%`;
  document.querySelectorAll('[data-requires]').forEach(el=>{
    const req=Number(el.dataset.requires);
    const unlocked = flowState.done.includes(req);
    if(el.tagName==='BUTTON') el.disabled=!unlocked;
    if(el.tagName==='A'){
      el.style.pointerEvents = unlocked ? '' : 'none';
      el.style.opacity = unlocked ? '' : '.45';
    }
    const card=el.closest('.card');
    if(card) card.classList.toggle('locked', !unlocked);
  });
  document.querySelectorAll('[data-dot]').forEach(el=>{
    const n=Number(el.dataset.dot);
    el.classList.toggle('done', flowState.done.includes(n));
  });
  const rank=document.getElementById('rankText'); if(rank) rank.textContent=fqRank();
}
function fqComplete(n){
  const first=!flowState.done.includes(n);
  if(first){
    flowState.done.push(n); flowState.xp += 100;
    if(flowState.xp>=FLOWQUEST_TOTAL_XP && !flowState.completedAt) flowState.completedAt=new Date().toISOString();
    fqSave(); fqCelebrate();
  }
  return first;
}
function fqReset(){
  if(confirm('Reset all FlowQuest progress on this browser?')){
    flowState={done:[],xp:0,completedAt:null}; fqSave(); location.href='index.html';
  }
}
function fqCelebrate(){
  const flash=document.createElement('div'); flash.className='screen-flash show'; document.body.appendChild(flash); setTimeout(()=>flash.classList.remove('show'),130); setTimeout(()=>flash.remove(),450);
  const colors=['#ffd166','#ef476f','#2fbf71','#1d70f7','#48cae4','#8e6cff'];
  for(let i=0;i<54;i++){
    const c=document.createElement('div'); c.className='confetti-piece';
    c.style.left=Math.random()*100+'vw'; c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration=(1.8+Math.random()*1.6)+'s'; c.style.animationDelay=(Math.random()*.35)+'s';
    c.style.transform=`rotate(${Math.random()*180}deg)`; document.body.appendChild(c); setTimeout(()=>c.remove(),3800);
  }
}
function fqCompletePanel(mission,nextHref){
  return `<div class="complete-pop"><h3>Mission Complete!</h3><div class="bigxp">+100 XP</div><p>Your new rank: <strong>${fqRank()}</strong></p>${mission===6?'<a class="btn green" href="score.html">View final score screen</a>':`<a class="btn green" href="${nextHref}">Continue to next mission</a>`}</div>`;
}
function fqHeader(){
  return `
  <header>
    <div class="wrap header-inner">
      <div class="brand">
        <img src="icon-map.svg" alt="FlowQuest icon">
        <div>
          <h1>FlowQuest</h1>
          <p>Algorithm Challenge Zone — Year 9 finishers</p>
        </div>
      </div>
      <div class="progressbox">
        <strong id="xpText">0 / 600 XP</strong>
        <div class="progressbar"><div class="progressfill" id="xpFill"></div></div>
      </div>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="score.html">Score</a>
        <button onclick="fqReset()">Reset</button>
      </nav>
    </div>
  </header>`;
}
function fqFooter(){ return '<footer>FlowQuest • Algorithms & Flowcharts • Built for GitHub Pages</footer>'; }
document.addEventListener('DOMContentLoaded', ()=>{
  const h=document.getElementById('siteHeader'); if(h) h.innerHTML=fqHeader();
  const f=document.getElementById('siteFooter'); if(f) f.innerHTML=fqFooter();
  fqRender();
});
