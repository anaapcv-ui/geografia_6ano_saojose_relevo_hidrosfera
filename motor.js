/* ===== MOTOR COMPARTILHADO — Quiz e Simulado | Corte do Terreno ===== */
/* Embaralhamento com semente fixa (mulberry32): a ordem é sempre a mesma
   em toda abertura, porque as respostas ficam salvas. A alternativa correta
   é guardada pelo OBJETO, nunca pela posição — por isso o gabarito não
   desalinha depois do embaralhamento. */

function mulberry32(a){
  return function(){
    a|=0; a=a+0x6D2B79F5|0;
    var t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

/* Embaralha as alternativas de cada questão.
   Entrada: lista de questões com alts[0] = CORRETA.
   Saída: cada questão ganha .ordem (array de objetos) e .certa (índice da correta
   DEPOIS do embaralhamento, achado pelo objeto e não pela posição). */
function prepararQuestoes(lista,semente){
  lista.forEach(function(q,i){
    var correta=q.alts[0];                 // guarda o OBJETO da correta
    var arr=q.alts.slice();
    var rnd=mulberry32(semente+i*7919);
    for(var k=arr.length-1;k>0;k--){
      var j=Math.floor(rnd()*(k+1));
      var tmp=arr[k]; arr[k]=arr[j]; arr[j]=tmp;
    }
    q.ordem=arr;
    q.certa=arr.indexOf(correta);          // reencontra a correta pelo objeto
  });
  return lista;
}

var LETRAS=['a','b','c','d'];

/* Código de liberação: PREFIXO-XX-YY. XX = acertos com zero à esquerda.
   YY = 2 letras aleatórias SEM I e sem O. Fica fixo no localStorage. */
function gerarCodigo(prefixo,acertos,chaveLS){
  var salvo=null;
  try{salvo=localStorage.getItem(chaveLS);}catch(e){}
  if(salvo&&salvo.indexOf(prefixo+'-'+pad2(acertos)+'-')===0)return salvo;
  var abc='ABCDEFGHJKLMNPQRSTUVWXYZ'; // sem I e sem O
  var yy=abc[Math.floor(Math.random()*abc.length)]+abc[Math.floor(Math.random()*abc.length)];
  var cod=prefixo+'-'+pad2(acertos)+'-'+yy;
  try{localStorage.setItem(chaveLS,cod);}catch(e){}
  return cod;
}
function pad2(n){return (n<10?'0':'')+n;}

/* Armazenamento com rede de segurança: se o navegador bloquear o
   localStorage, o material continua funcionando na memória. */
function criarStore(KEY,vazio){
  var mem=JSON.parse(JSON.stringify(vazio));
  return {
    ler:function(){
      try{return JSON.parse(localStorage.getItem(KEY)||'null')||JSON.parse(JSON.stringify(vazio));}
      catch(e){return mem;}
    },
    gravar:function(s){
      try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){mem=s;}
    },
    limpar:function(){
      try{localStorage.removeItem(KEY);}catch(e){}
      mem=JSON.parse(JSON.stringify(vazio));
    }
  };
}

function agoraBR(){
  var d=new Date();
  return d.toLocaleDateString('pt-BR')+' às '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}

/* Modal desenhado na própria página — nunca alert/confirm/prompt,
   que travam a página e assustam a criança. */
function montarModal(){
  if(document.getElementById('overlay'))return;
  var d=document.createElement('div');
  d.className='overlay'; d.id='overlay';
  d.innerHTML='<div class="modal"><h3 id="mTit">Aviso</h3><p id="mTxt"></p>'+
    '<div class="acoes"><button id="mNao" style="display:none">Cancelar</button>'+
    '<button class="principal" id="mSim">Entendi</button></div></div>';
  document.body.appendChild(d);
}
function aviso(t,msg,onSim,comCancelar){
  montarModal();
  document.getElementById('mTit').textContent=t;
  document.getElementById('mTxt').textContent=msg;
  document.getElementById('mNao').style.display=comCancelar?'inline-block':'none';
  var ov=document.getElementById('overlay'); ov.classList.add('on');
  document.getElementById('mSim').onclick=function(){ov.classList.remove('on'); if(onSim)onSim();};
  document.getElementById('mNao').onclick=function(){ov.classList.remove('on');};
}

if(typeof module!=='undefined'&&module.exports){
  module.exports={mulberry32:mulberry32,prepararQuestoes:prepararQuestoes,gerarCodigo:gerarCodigo,pad2:pad2,LETRAS:LETRAS};
}
