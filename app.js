const $ = (s) => document.querySelector(s);
const state = { balance: 10000, filter: "hot", claimed: false, brand: "Fortune Arcade" };

const themes = {
  fortune: {name:"FORTUNE ARCADE", accent:"#8cf3c2", accent2:"#7e8cff", bg:"#080d1b"},
  nova: {name:"NOVA PLAY", accent:"#ffd36e", accent2:"#ff7ab6", bg:"#171024"},
  velvet: {name:"VELVET SPIN", accent:"#ff9ac7", accent2:"#a99aff", bg:"#21101e"}
};
const games = [
  {id:1,name:"Fortune Tiger",provider:"PG-style demo",emoji:"🐯",tag:"QUENTE",players:"12,4k",hot:true,art:"linear-gradient(135deg,#e58b24,#7d241c)"},
  {id:2,name:"Fortune Snake",provider:"Arcade studio",emoji:"🐍",tag:"NOVO",players:"8,1k",hot:true,art:"linear-gradient(135deg,#6d38cf,#1c1f65)"},
  {id:3,name:"Fortune Mouse",provider:"Arcade studio",emoji:"🐭",tag:"QUENTE",players:"7,6k",hot:true,art:"linear-gradient(135deg,#ffbd43,#b52e32)"},
  {id:4,name:"Dragon Hatch",provider:"Mythic games",emoji:"🐲",tag:"NOVO",players:"6,9k",hot:false,art:"linear-gradient(135deg,#cf465a,#4d173f)"},
  {id:5,name:"Ox Fortune",provider:"Mythic games",emoji:"🐂",tag:"QUENTE",players:"9,2k",hot:true,art:"linear-gradient(135deg,#9a6a40,#273c55)"},
  {id:6,name:"Fortune Tiger Gold",provider:"Arcade studio",emoji:"🪙",tag:"QUENTE",players:"13,2k",hot:true,art:"linear-gradient(135deg,#e8a62b,#7e3c16)"},
  {id:7,name:"Fortune Dragon",provider:"Mythic games",emoji:"🐉",tag:"NOVO",players:"5,7k",hot:false,art:"linear-gradient(135deg,#8d55ff,#164e7e)"},
  {id:8,name:"Fortune Horse",provider:"Arcade studio",emoji:"🐴",tag:"QUENTE",players:"11,8k",hot:true,art:"linear-gradient(135deg,#e15a8d,#40205d)"}
];

function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300)}
function fmt(n){return n.toLocaleString("pt-BR")}
function setBalance(n){state.balance=n;$("#balance").textContent=fmt(n)}
function renderGames(){
  const list=games.filter(g=>state.filter==="all"||(state.filter==="hot"?g.hot:g.tag==="NOVO"));
  $("#gameGrid").innerHTML=list.map(g=>`
    <article class="game-card">
      <div class="game-art" style="--art:${g.art}">
        <span class="game-tag">${g.tag}</span><span>${g.emoji}</span>
      </div>
      <div class="game-info"><h3>${g.name}</h3><p>${g.provider}</p>
        <div class="game-footer"><span class="players">🟢 ${g.players}</span><button class="play-btn" data-play="${g.id}">Jogar</button></div>
      </div>
    </article>`).join("");
  document.querySelectorAll("[data-play]").forEach(b=>b.addEventListener("click",()=>playGame(Number(b.dataset.play))));
}
function openModal(title,body){$("#modalTitle").textContent=title;$("#modalBody").innerHTML=body;$("#modal").showModal()}
function playGame(id){
  const game=games.find(g=>g.id===id);
  openModal(game.name,`<div class="modal-content"><p>Você está entrando em uma rodada demonstrativa com moedas virtuais.</p><div class="field"><label>Valor da rodada</label><input id="bet" type="number" min="10" max="500" step="10" value="100"></div><button class="btn btn-primary" id="spin">Girar rolos</button><p id="result" class="hero-note">Nenhum resultado ainda.</p></div>`);
  $("#spin").addEventListener("click",()=>{
    const bet=Math.max(10,Math.min(500,Number($("#bet").value)||100));
    if(state.balance<bet){$("#result").textContent="Saldo virtual insuficiente. Resgate o bônus diário.";return}
    setBalance(state.balance-bet);
    const win=Math.random()<.34;
    const prize=win?bet*(Math.random()<.12?8:2):0;
    setBalance(state.balance+prize);
    $("#result").textContent=win?`🎉 Resultado: você ganhou ${fmt(prize)} moedas virtuais!`:`Resultado: não houve prêmio nesta rodada.`;
  });
}
function claimDaily(){
  if(state.claimed){toast("Bônus diário já resgatado nesta sessão.");return}
  state.claimed=true;setBalance(state.balance+500);toast("+500 moedas virtuais adicionadas!");
}
function showSignup(){openModal("Criar conta",`<div class="modal-content"><p>Cadastro local de demonstração — nenhum dado é enviado.</p><div class="field"><label>Apelido</label><input placeholder="Seu apelido"></div><div class="field"><label>E-mail fictício</label><input type="email" placeholder="voce@exemplo.com"></div><button class="btn btn-primary" id="create">Criar perfil demo</button></div>`);$("#create").addEventListener("click",()=>{toast("Perfil demo criado!");$("#modal").close()})}
function showLogin(){openModal("Entrar",`<div class="modal-content"><p>Esta versão é uma demonstração local.</p><div class="field"><label>Apelido</label><input placeholder="demo"></div><button class="btn btn-primary" id="enter">Entrar no modo demo</button></div>`);$("#enter").addEventListener("click",()=>{toast("Você entrou no modo demo.");$("#modal").close()})}
function applyTheme(key){const t=themes[key]||themes.fortune;document.documentElement.style.setProperty("--accent",t.accent);document.documentElement.style.setProperty("--accent-2",t.accent2);document.documentElement.style.setProperty("--bg",t.bg);$("#brandName").textContent=t.name}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{state.filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderGames()}));
document.querySelectorAll(".quick-card").forEach(b=>b.addEventListener("click",()=>{const a=b.dataset.action;if(a==="daily"||a==="checkin")claimDaily();else if(a==="wheel")playGame(3);else if(a==="mystery"){setBalance(state.balance+Math.floor(Math.random()*250));toast("Você encontrou uma surpresa virtual!")}else toast("Missões demonstrativas disponíveis em breve.")}));
$("#dailyBtn").addEventListener("click",claimDaily);$("#playFeatured").addEventListener("click",()=>playGame(1));$("#loginBtn").addEventListener("click",showLogin);$("#signupBtn").addEventListener("click",showSignup);$("#closeModal").addEventListener("click",()=>$("#modal").close());
$("#inviteBtn").addEventListener("click",()=>openModal("Convite social",`<div class="modal-content"><p>Seu código demonstrativo:</p><strong style="font-size:28px;letter-spacing:.15em">NOVA-7K2P</strong><p>Compartilhe apenas como exemplo de interface. Não há programa de afiliados ativo.</p></div>`));
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x===b));toast(b.dataset.nav==="home"?"Você já está na página inicial.":"Seção demonstrativa: "+b.dataset.nav)}));
const params=new URLSearchParams(location.search);applyTheme(params.get("brand")||"fortune");renderGames();
