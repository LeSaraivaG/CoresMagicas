// ==================== ELEMENTOS DA TELA ====================
const areaCor = document.getElementById('areaCor');
const textoPontuacao = document.getElementById('textoPontuacao');
const textoVidas = document.getElementById('textoVidas');
const textoFase = document.getElementById('textoFase');
 const textoCor = document.getElementById('textoCor');
const progressoCores = document.getElementById('progressoCores');
const textoProgresso = document.getElementById('textoProgresso');
const nomeFaseDiv = document.getElementById('nomeFase');
const faseIcone = document.getElementById('faseIcone');
const status1 = document.getElementById('status1');
const status2 = document.getElementById('status2');
const status3 = document.getElementById('status3');
const status4 = document.getElementById('status4');
const status5 = document.getElementById('status5');

// Indicadores animados
const indicador1 = document.getElementById('indicador1');
const indicador2 = document.getElementById('indicador2');
const indicador3 = document.getElementById('indicador3');
//const indicador4 = document.getElementById('indicador4');
const indicador5 = document.getElementById('indicador5');

// Botões
const btnIniciar = document.getElementById('btnIniciar');
const btnPausar = document.getElementById('btnPausar');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnZerar = document.getElementById('btnZerar');
const btnPlacar= document.getElementById('btnPlacar');
const btnPgUp = document.getElementById('btnPgUp');
const btnPgDn = document.getElementById('btnPgDn');

//00000000000000000000000000000000
//00000000000000000000000000000000
// Para o botão Regras
const regrasBtn = document.getElementById('btnRegras'); 
if (regrasBtn) {
    regrasBtn.addEventListener('click', abrirModal);
}

// Função para abrir o modal

function abrirModal() {
    const modal = document.getElementById('RegrasModal');
    const modalBody = document.getElementById('modal-body');
    // Copia o conteúdo das regras para dentro do modal
    modalBody.innerHTML = document.getElementById('regras-content').innerHTML;
    modal.style.display = 'flex';
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('RegrasModal');
    if (modal) modal.style.display = 'none';
}

// Evento para o "X"
const closeBtn = document.querySelector('.close-modal');
if (closeBtn) {
    closeBtn.addEventListener('click', fecharModal);
}

// Clicar fora do conteúdo do modal também fecha
window.addEventListener('click', (e) => {
    const modal = document.getElementById('RegrasModal');
    if (e.target === modal) {
        fecharModal();
    }
});

//0000000000000000000000000000000000
//ooooooooooooooooooooooooooooooooooooo
// Sons (não reutilizar o mesmo objeto)
function tocarSom(arquivo) {
    const audio = new Audio(arquivo);
    audio.play().catch(e => console.log('Erro ao tocar som:', e));}
// Pré-carregar sons (cache)
const sons = ['Pistom.mp3', 'Eita.mp3', 'Garotinha.mp3', 'Vitoria.mp3', 'Tam-tam.mp3', 'laser.mp3'];
sons.forEach(s => { const a = new Audio(s); a.load(); });

// Sons   
///const somAcerto = new Audio('Pistom.mp3');
//const somErro = new Audio('Eita.mp3');
//const somPassouFase = new Audio('Garotinha.mp3');
//const somBonusVida = new Audio('Tam-tam.mp3');
//const somVidaExtra = new Audio('Vitoria.mp3');
//const somRecorde = new Audio('laser.mp3');

// Para a estrela secreta      laser.mp3
const secretBtn = document.getElementById('secretLifeBtn');
if (secretBtn) {
    secretBtn.addEventListener('click', ganharVidaExtra);
}


// ==================== VARIÁVEIS GLOBAIS ====================
let scriptAtivo = false;
let scriptPausado = true;
let pontuacao = 0;
let vidas = 3;
let faseAtual = 1;
let corAtual = 'Nenhuma';
let tempoTroca = 1000; // ms    1000
let timerCor = null;
let ultimoBonusVida = 0;
// let ultimaCorPremiada = '';
let tempoCooldown = 0; // ms   500    100
let ultimoAcertoTime = 0;

// Animações dos emojis (arrays e timers)
let animTimers = [];
const anim1_emojis = ['🌿', '⏳', '🌸', '🚀', '💚'];
let anim1_idx = 0;
const anim2_emojis = ['🐉', '🐍'];
let anim2_idx = 0;
const anim3_emojis = ['❤️', '💖', '💗', '💓', '💕'];
let anim3_idx = 0;
const anim5_emojis = [' ', '👉🏻'];
let anim5_idx = 0;

// Cores por fase (idêntico ao AHK)
const coresCertasPgUp = {
    1: ['Verde'],
    2: ['Verde', 'Amarelo'],
    3: ['Verde', 'Amarelo', 'Olive'],
    4: ['Verde', 'Amarelo', 'Olive', 'Azul'],
    5: ['Verde', 'Amarelo', 'Olive', 'Azul', 'Vermelho']
};
const coresCertasPgDn = {
    1: ['Fucsia'],
    2: ['Fucsia', 'Marrom'],
    3: ['Fucsia', 'Marrom', 'Cinza'],
    4: ['Fucsia', 'Marrom', 'Cinza', 'Laranja'],
    5: ['Fucsia', 'Marrom', 'Cinza', 'Laranja', 'Preto']
};
const coresPorFase = {
    1: ['Verde', 'Vermelho', 'Fucsia'],
    2: ['Verde', 'Amarelo', 'Fucsia', 'Marrom'],
    3: ['Verde', 'Amarelo', 'Olive', 'Fucsia', 'Marrom', 'Cinza'],
    4: ['Verde', 'Amarelo', 'Olive', 'Azul', 'Fucsia', 'Marrom', 'Cinza', 'Laranja'],
    5: ['Verde', 'Amarelo', 'Olive', 'Azul', 'Fucsia', 'Marrom', 'Cinza', 'Laranja', 'Preto']
};
const nomesFase = [' Floresta Verde', ' Jardim Feliz', ' Bosque Mágico', ' Vale das Flores', ' Desafio Final'];
const coresFundo = {
    Inicial: '#FF7000',
    Fase1: '#4B0082',
    Fase2: '#3A2A1E',
    Fase3: '#1E2A3A',
    Fase4: '#00BFFF',
    Fase5: '#2A2A2A'
};

// ==================== FUNÇÕES AUXILIARES ====================
function mudarFundo(etapa) {
    const cor = coresFundo[etapa];
    if (cor) document.querySelector('.game-container').style.backgroundColor = cor;
}

function criarCoracoes(qtd) {
    return '❤️'.repeat(qtd);
}

function corEstaNaLista(cor, lista) {
    return lista.includes(cor);
}

function atualizarBarraProgresso() {
    const totalPontosFase5 = 300;
    let progresso = 0;
    if (pontuacao >= totalPontosFase5) progresso = 100;
    else progresso = Math.round((pontuacao * 100) / totalPontosFase5);
    progressoCores.style.width = progresso + '%';
    textoProgresso.innerText = progresso + '%';
}

function atualizarInterface() {
    textoPontuacao.innerText = pontuacao;
    textoVidas.innerText = criarCoracoes(vidas);
    textoFase.innerText = faseAtual;

    // Bônus de vida a cada 100 pontos (máx 5)
    if (pontuacao >= ultimoBonusVida + 100 && vidas < 5) {
        vidas++;
        ultimoBonusVida = pontuacao - (pontuacao % 100);
        textoVidas.innerText = criarCoracoes(vidas);
        tocarSom('Tam-tam.mp3')
        status1.innerText = 'Bônus: uma vida!';
        setTimeout(() => { if (status1.innerText === 'Bônus: uma vida!') status1.innerText = ''; }, 800);
        
    }

    // Game over
  //  if (vidas <= 0) {
   if (vidas <= 0) {
    const novoRecorde = salvarRecorde(pontuacao);
    if (novoRecorde) {
        alert(`🎉 PARABÉNS! NOVO RECORDE: ${pontuacao} pontos! 🎉`);
    }

   //........................................................................................
   if (timerCor) clearInterval(timerCor);
        status4.innerText = 'Fim de jogo!';
        status5.innerText = `Você fez ${pontuacao} pontos. Parabéns!`;
        pontuacao = 0;
        vidas = 3;
        faseAtual = 1;
        mudarFundo('Fase1');
        atualizarBarraProgresso();
        // reseta também interface mas não inicia automaticamente
        textoPontuacao.innerText = pontuacao;
        textoVidas.innerText = criarCoracoes(vidas);
        textoFase.innerText = faseAtual;
        nomeFaseDiv.innerText = nomesFase[0];
        faseIcone.src = 'Fase1.png';
        corAtual = 'Nenhuma';
        areaCor.style.backgroundColor = '#888';
        scriptAtivo = false;
        scriptPausado = true;
        return;
    }

    // Verifica passagem de fase (apenas uma por chamada)
    if (faseAtual === 1 && pontuacao >= 50) {
        avancarFase(2);
        return;
    }
    if (faseAtual === 2 && pontuacao >= 100) {
        avancarFase(3);
        return;
    }
    if (faseAtual === 3 && pontuacao >= 200) {
        avancarFase(4);
        return;
    }
    if (faseAtual === 4 && pontuacao >= 300) {
        avancarFase(5);
        return;
    }

    atualizarBarraProgresso();
}

function avancarFase(novaFase) {
    faseAtual = novaFase;
    textoFase.innerText = faseAtual;
    tocarSom('Garotinha.mp3')

    if (novaFase >= 1 && novaFase <= 5) {
        nomeFaseDiv.innerText = nomesFase[novaFase-1];
        const imgPath = `Fase${novaFase}.png`;
        faseIcone.src = imgPath;
    }

    // Aumenta velocidade
    tempoTroca = 1200 - (novaFase - 1) * 100;    // 1500
    if (tempoTroca < 600) tempoTroca = 600;     // 500
    if (timerCor) {
        clearInterval(timerCor);
        if (scriptAtivo && !scriptPausado) {
            timerCor = setInterval(trocarCor, tempoTroca);
        }
    }

    // Muda fundo
    mudarFundo('Fase' + novaFase);
}

function trocarCor() {
    if (!scriptAtivo || scriptPausado) return;
    const lista = coresPorFase[faseAtual];
    const indice = Math.floor(Math.random() * lista.length);
    corAtual = lista[indice].trim();
    textoCor.innerText = corAtual;

    // Muda a cor da área
    switch(corAtual) {
        case 'Verde': areaCor.style.backgroundColor = '#2e7d32'; break;
        case 'Fucsia': areaCor.style.backgroundColor = '#9c27b0'; break;
        case 'Amarelo': areaCor.style.backgroundColor = '#fbc02d'; break;
        case 'Marrom': areaCor.style.backgroundColor = '#795548'; break;
        case 'Olive': areaCor.style.backgroundColor = '#808000'; break;
        case 'Preto': areaCor.style.backgroundColor = '#222'; break;
        case 'Cinza': areaCor.style.backgroundColor = '#9e9e9e'; break;
        case 'Azul': areaCor.style.backgroundColor = '#1976d2'; break;
        case 'Vermelho': areaCor.style.backgroundColor = '#d32f2f'; break;
        case 'Laranja': areaCor.style.backgroundColor = '#f57c00'; break;
        default: areaCor.style.backgroundColor = '#888';
    }
}
//...............................................................................
function processarAcerto(tipo) {
    if (!scriptAtivo || scriptPausado) return false;
    if (vidas <= 0) return false;

    const agora = Date.now();
    // Sem cooldown, remova a verificação ou deixe como 0

    const corNoMomento = corAtual;
    console.log(`Clique: ${tipo}, cor: ${corNoMomento}, fase: ${faseAtual}`);

    let acertou = false;
    if (tipo === 'PgUp') {
        acertou = corEstaNaLista(corNoMomento, coresCertasPgUp[faseAtual]);
    } else {
        acertou = corEstaNaLista(corNoMomento, coresCertasPgDn[faseAtual]);
    }

    // Feedback visual no botão
    const btn = (tipo === 'PgUp') ? btnPgUp : btnPgDn;
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        const originalBg = btn.style.backgroundColor;
        btn.style.backgroundColor = acertou ? '#C0C0C0' : '#C0C0C0';
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.backgroundColor = originalBg;
        }, 150);
    }

    if (acertou) {
        pontuacao += 10;
        tocarSom('Pistom.mp3');
        atualizarInterface();
        console.log(`Acertou! Pontos: ${pontuacao}`);
//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
 verificarNovoRecorde(pontuacao);
 //uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
        return true;
    } else {
        vidas--;
        tocarSom('Eita.mp3');
        textoVidas.innerText = criarCoracoes(vidas);
        atualizarInterface();
        console.log(`Errou! Vidas restantes: ${vidas}`);
        return false;
    }
}

// Eventos com suporte a toque
function bindTouchClick(el, handler) {
    if (!el) return;
    el.addEventListener('click', handler);
    el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handler(e);
    });
}
bindTouchClick(btnPgUp, () => processarAcerto('PgUp'));
bindTouchClick(btnPgDn, () => processarAcerto('PgDn'));

// ==================== ANIMAÇÕES DOS INDICADORES ====================
function iniciarAnimacoes() {
    if (animTimers.length) pararAnimacoes();
    animTimers.push(setInterval(() => {
        indicador1.innerText = anim1_emojis[anim1_idx % anim1_emojis.length];
        anim1_idx++;
    }, 300));
    animTimers.push(setInterval(() => {
        indicador2.innerText = anim2_emojis[anim2_idx % anim2_emojis.length];
        anim2_idx++;
    }, 1000));
    animTimers.push(setInterval(() => {
        indicador3.innerText = anim3_emojis[anim3_idx % anim3_emojis.length];
        anim3_idx++;
    }, 1500));
 
    animTimers.push(setInterval(() => {
        indicador5.innerText = anim5_emojis[anim5_idx % anim5_emojis.length];
        anim5_idx++;
    }, 800));
}

function pararAnimacoes() {
    animTimers.forEach(t => clearInterval(t));
    animTimers = [];
}

// ==================== CONTROLES DO JOGO ====================
//function iniciarJogo() {
//................................................................................................
function iniciarJogo() {
    // Ativa tela cheia (se ainda não estiver)
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    }

   //................................................................................................  
  if (timerCor) clearInterval(timerCor);
    scriptAtivo = true;
    scriptPausado = false;
    status1.innerText = 'Jogo iniciado.';
    status2.innerText = 'Verificando...';
    status4.innerText = '';
    status5.innerText = '';
    pontuacao = 0;
    vidas = 3;
    faseAtual = 1;
    ultimoBonusVida = 0;
  //   ultimaCorPremiada = '';
    ultimoAcertoTime = 0;
    tempoTroca = 1500;    //  1000;
    textoPontuacao.innerText = pontuacao;
    textoVidas.innerText = criarCoracoes(vidas);
    textoFase.innerText = faseAtual;
    nomeFaseDiv.innerText = nomesFase[0];
    faseIcone.src = 'Fase1.png';
    mudarFundo('Fase1');
    atualizarBarraProgresso();
    corAtual = 'Nenhuma';
    textoCor.innerText = '---';
    areaCor.style.backgroundColor = '#888';
    if (timerCor) clearInterval(timerCor);
    timerCor = setInterval(trocarCor, tempoTroca);
    iniciarAnimacoes();
}

function pausarJogo() {
    scriptPausado = true;
    if (timerCor) clearInterval(timerCor);
    timerCor = null;
    pararAnimacoes();
    status1.innerText = 'Jogo pausado.';
    status2.innerText = 'Aguardando...';
}

function reiniciarJogo() {
    if (timerCor) clearInterval(timerCor);
    scriptAtivo = false;
    scriptPausado = true;
    pararAnimacoes();
    pontuacao = 0;
    vidas = 3;
    faseAtual = 1;
    ultimoBonusVida = 0;
    tempoTroca = 1000;
    textoPontuacao.innerText = pontuacao;
    textoVidas.innerText = criarCoracoes(vidas);
    textoFase.innerText = faseAtual;
    nomeFaseDiv.innerText = nomesFase[0];
    faseIcone.src = 'Fase1.png';
    mudarFundo('Fase1');
    atualizarBarraProgresso();
    corAtual = 'Nenhuma';
    textoCor.innerText = '---';
    areaCor.style.backgroundColor = '#888';
    status2.innerText = 'Clique em Iniciar!';
    status4.innerText = '';
    status5.innerText = '';
    timerCor = null;
}

function zerarPontuacao() {
    pontuacao = 0;
    textoPontuacao.innerText = pontuacao;
    atualizarBarraProgresso();
    status1.innerText = 'Pontuação zerada!';
    setTimeout(() => { if (status1.innerText === 'Pontuação zerada!') status1.innerText = ''; }, 800);
}

function sairJogo() {
    if (timerCor) clearInterval(timerCor);
    scriptAtivo = false;
    scriptPausado = true;
    pararAnimacoes();
    // apenas reseta visualmente
    reiniciarJogo();
    status1.innerText = 'Script encerrado.';
    status2.innerText = 'Feche a página para sair completamente.';
}

//..............................................................
function togglePlacar() {
   if (document.fullscreenElement) {
       document.exitFullscreen();
        // Ao sair da tela cheia, mostra o recorde (opcional)
        mostrarRecorde();
    } else {
        document.documentElement.requestFullscreen();
   }
}
//...............................................................
function ganharVidaExtra() {
    if (vidas < 5) {
        vidas++;
        textoVidas.innerText = criarCoracoes(vidas);
        tocarSom('Vitoria.mp3')  
        status3.innerText = 'Vida extra!';
        setTimeout(() => { if (status3.innerText === 'Vida extra!') status3.innerText = ''; }, 800);
    } else {
        status3.innerText = 'Vidas no máximo!';
        setTimeout(() => { if (status3.innerText === 'Vidas no máximo!') status3.innerText = ''; }, 800);
    }
}
//..........................................................................................
// Salva a maior pontuação no navegador
function salvarRecorde(pontos) {
    let recorde = localStorage.getItem('recordeCores') || 0;
    if (pontos > recorde) {
        localStorage.setItem('recordeCores', pontos);
        return true; // novo recorde
    }
    return false;
}

// Lê o recorde salvo

function obterRecorde() {
    return localStorage.getItem('recordeCores') || 0;
}

// Mostra o recorde num alerta ou modal (pode ser um modal simples)

function mostrarRecorde() {
    const recorde = obterRecorde();
    document.getElementById('recordeValor').innerText = recorde;
    document.getElementById('recordeModal').style.display = 'flex';
}

// Fechar modal de recorde ao clicar no X

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal de recorde
    const recordeModal = document.getElementById('recordeModal');
    const closeRecordeX = document.getElementById('closeRecordeModal');
    const closeRecordeBtn = document.getElementById('fecharRecordeBtn');
    // Fechar ao clicar no X
    if (closeRecordeX) {
        closeRecordeX.addEventListener('click', function() {
            recordeModal.style.display = 'none';
        });
    }

    // Fechar ao clicar no botão Fechar
    if (closeRecordeBtn) {
        closeRecordeBtn.addEventListener('click', function() {
            recordeModal.style.display = 'none';
        });
    }

    // (Opcional) Fechar ao clicar fora do modal
    window.addEventListener('click', function(e) {
        if (e.target === recordeModal) {
            recordeModal.style.display = 'none';
        }
    
    });
});
//oooooooooooooooooooooooooooooooooooooooooooooooooooooo
// Função para verificar se bateu o recorde
function verificarNovoRecorde(pontos) {
    let recorde = localStorage.getItem('recordeCores') || 0;
    if (pontos > recorde) {
        // Toca o som de novo recorde
        tocarSom('laser.mp3');  // ou 'Recorde.mp3' se você adicionar um arquivo específico
        
        // Salva o novo recorde
        localStorage.setItem('recordeCores', pontos);
        
        // Mostra mensagem na tela (opcional)
        const msg = document.createElement('div');
        msg.innerText = '🎉 NOVO RECORDE! 🎉';
        msg.style.position = 'fixed';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.backgroundColor = 'gold';
        msg.style.color = '#4B0082';
        msg.style.padding = '20px';
        msg.style.borderRadius = '50px';
        msg.style.fontSize = '2rem';
        msg.style.fontWeight = 'bold';
        msg.style.zIndex = '9999';
        msg.style.textAlign = 'center';
        msg.style.boxShadow = '0 0 20px black';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
        
        return true;
    }
    return false;
}
//uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
// ==================== EVENTOS ====================

btnIniciar.addEventListener('click', iniciarJogo);
btnPausar.addEventListener('click', pausarJogo);
btnReiniciar.addEventListener('click', reiniciarJogo);
btnZerar.addEventListener('click', zerarPontuacao);
btnPlacar.addEventListener('click', togglePlacar);
btnPgUp.addEventListener('click', () => processarAcerto('PgUp'));
btnPgUp.addEventListener('touchstart', (e) => {
    e.preventDefault();  // evita zoom ou rolagem
    processarAcerto('PgUp');
});
btnPgDn.addEventListener('click', () => processarAcerto('PgDn'));
btnPgDn.addEventListener('touchstart', (e) => {
    e.preventDefault();  // evita zoom ou rolagem
    processarAcerto('PgDn');
});
// Teclado (opcional, para testes no PC)
window.addEventListener('keydown', (e) => {
    if (e.key === 'PageUp') {
        e.preventDefault();
        processarAcerto('PgUp');
    } else if (e.key === 'PageDown') {
        e.preventDefault();
        processarAcerto('PgDn');
    }
});

// Inicializa a interface sem iniciar o jogo
reiniciarJogo();
