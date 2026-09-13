const symbols=[
  {name:"tiger",src:"assets/tiger.png",label:"Tigre",pay:50},
  {name:"gold",src:"assets/gold.png",label:"Ouro",pay:25},
  {name:"coin",src:"assets/coin.png",label:"Moeda",pay:15},
  {name:"red-envelope",src:"assets/red-envelope.png",label:"Envelope da sorte",pay:10},
  {name:"orange",src:"assets/orange.png",label:"Laranja",pay:5},
  {name:"jade",src:"assets/jade.png",label:"Jade",pay:3}
];

let balance=1000, bet=10, busy=false, sound=true;
const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function fmt(n){return n.toLocaleString("pt-BR")}
function render(){
  $("balance").textContent=fmt(balance);
  $("bet").textContent=bet;
  $("betLabel").textContent=bet;
}
function randomSymbol(){return symbols[Math.floor(Math.random()*symbols.length)]}

function makeCell(item){
  return `<img src="${item.src}" alt="${item.label}"><span class="symbol-spark"></span>`;
}
function setReels(vals){
  document.querySelectorAll(".reel").forEach((r,i)=>{
    r.querySelectorAll(".symbol").forEach((s,j)=>{
      const item=vals[i*3+j]||randomSymbol();
      s.dataset.name=item.name;
      s.innerHTML=makeCell(item);
    });
  });
}

function currentTopRow(){
  return [...document.querySelectorAll(".reel .symbol")].filter((_,i)=>i%3===0);
}

function pulseTopRow(){
  currentTopRow().forEach((cell,i)=>{
    setTimeout(()=>cell.classList.add("hit"),i*100);
    setTimeout(()=>cell.classList.remove("hit"),i*100+850);
  });
}

function confetti(amount=28){
  const layer=$("fxLayer");
  for(let i=0;i<amount;i++){
    const c=document.createElement("span");
    c.className="coin-fx";
    c.textContent=i%3===0?"🪙":"✦";
    c.style.left=(35+Math.random()*30)+"%";
    c.style.setProperty("--x",(Math.random()*420-210)+"px");
    c.style.setProperty("--r",(Math.random()*900-450)+"deg");
    c.style.setProperty("--d",(900+Math.random()*1100)+"ms");
    layer.appendChild(c);
    setTimeout(()=>c.remove(),2200);
  }
}

async function spin(){
  if(busy||balance<bet)return;
  busy=true;
  $("spin").disabled=true;
  $("reels").classList.remove("winning");
  $("message").textContent="Preparando...";
  $("win").textContent="";
  balance-=bet; render();

  $("reelStage").classList.add("active");
  $("spin").classList.add("pressing");

  const reels=[...document.querySelectorAll(".reel")];
  reels.forEach((r,i)=>{
    r.classList.remove("stopping");
    r.style.setProperty("--delay",`${i*90}ms`);
  });

  // Fast preview symbols while the reels spin.
  let ticks=0;
  const ticker=setInterval(()=>{
    setReels(Array.from({length:9},randomSymbol));
    ticks++;
  },70);

  await sleep(850);
  clearInterval(ticker);

  // Each reel stops at a different moment, creating a professional cascade.
  const a=randomSymbol();
  const guaranteedWin=Math.random()<0.10;
  const vals=guaranteedWin
    ? [a,a,a,...Array.from({length:6},randomSymbol)]
    : Array.from({length:9},randomSymbol);

  reels.forEach((r,i)=>{
    setTimeout(()=>{
      r.classList.add("stopping");
      setReels(vals);
      if(i===2) finishRound(vals);
    },i*230);
  });
}

function finishRound(vals){
  setTimeout(()=>{
    $("reelStage").classList.remove("active");
    $("spin").classList.remove("pressing");

    let prize=0;
    if(vals[0].name===vals[1].name && vals[1].name===vals[2].name){
      prize=bet*(vals[0].pay||0);
    }

    balance+=prize; render();

    if(prize){
      $("reels").classList.add("winning");
      pulseTopRow();
      confetti(Math.min(55,20+Math.floor(prize/bet)));
      $("win").textContent=`🎉 VOCÊ GANHOU ${fmt(prize)} CRÉDITOS!`;
      $("message").textContent="Grande prêmio!";
    }else{
      $("message").textContent="Boa sorte!";
      $("win").textContent="Nenhum prêmio — tente novamente";
    }

    busy=false;
    $("spin").disabled=false;
  },420);
}

$("minus").onclick=()=>{if(!busy){bet=Math.max(1,bet-5);render()}};
$("plus").onclick=()=>{if(!busy){bet=Math.min(100,bet+5);render()}};
$("max").onclick=()=>{if(!busy){bet=100;render()}};
$("reset").onclick=()=>{
  if(busy)return;
  balance=1000;bet=10;render();
  $("win").textContent="Créditos reiniciados.";
  $("message").textContent="Boa sorte!";
};
$("soundBtn").onclick=()=>{
  sound=!sound;
  $("soundBtn").textContent=sound?"🔊":"🔇";
};
$("spin").onclick=spin;

setReels(Array.from({length:9},randomSymbol));
render();
