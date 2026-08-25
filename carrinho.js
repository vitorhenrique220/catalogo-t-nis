let metodoSelecionado = 'credito';
let bandeiraSelecionada = '';


function atualizarTopoUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const areaLoginTopo = document.getElementById('area-login-topo');

    if (areaLoginTopo && usuarioLogado && usuarioLogado.nome) {
        const primeiroNome = usuarioLogado.nome.split(' ')[0];
        areaLoginTopo.href = 'minha-conta.html';
        areaLoginTopo.innerHTML = `
            <span class="icon-user">👤</span>
            <div class="account-text">
                <strong style="color: #0088ff;">Olá, ${primeiroNome}</strong>
                <small>Minha Conta</small>
            </div>
        `;
    }
}


function mostrarToast(mensagem, tipo = 'sucesso') {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }

    const icone = tipo === 'aviso' ? '⚠️' : '✓';
    toast.innerHTML = `
        <span style="color:#ff3333; font-weight:bold; margin-right:5px;">${icone}</span>
        ${mensagem}
    `;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function converterPrecoParaNumero(preco) {
    if (typeof preco === 'number') return preco;
    if (!preco) return 0;

    let limpo = preco
        .toString()
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();

    return parseFloat(limpo) || 0;
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    const container = document.getElementById('lista-carrinho');
    const elSubtotal = document.getElementById('subtotal');
    const elTotal = document.getElementById('total-pedido');
    let subtotal = 0;

    if (carrinho.length === 0) {
        if (container) {
            container.innerHTML = `
                <p class="carrinho-vazio">
                    Seu carrinho está vazio.
                    <a href="index.html">Voltar para a loja.</a>
                </p>
            `;
        }
        if (elSubtotal) elSubtotal.innerText = 'R$ 0,00';
        if (elTotal) elTotal.innerText = 'R$ 0,00';
        atualizarContador();
        return;
    }

    if (container) {
        container.innerHTML = '';

        carrinho.forEach((item, index) => {
            const precoUnitario = converterPrecoParaNumero(item.preco);
            const quantidade = Number(item.quantidade) || 1;
            const totalItem = precoUnitario * quantidade;

            subtotal += totalItem;

            container.innerHTML += `
                <div class="item-carrinho">
                    <img src="${item.imagem}" alt="${item.nome}" width="80">
                    <div class="item-detalhes">
                        <h4>${item.nome}</h4>
                        <span class="item-preco">${formatarMoeda(precoUnitario)}</span>
                    </div>

                    <div class="item-qtd">
                        <button onclick="alterarQtd(${index}, -1)">-</button>
                        <span>${quantidade}</span>
                        <button onclick="alterarQtd(${index}, 1)">+</button>
                    </div>

                    <button class="btn-remover" onclick="removerItem(${index})">🗑️</button>
                </div>
            `;
        });
    }

    if (elSubtotal) elSubtotal.innerText = formatarMoeda(subtotal);
    if (elTotal) elTotal.innerText = formatarMoeda(subtotal);

    atualizarContador();
}

function alterarQtd(index, mudanca) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    if (!carrinho[index]) return;

    carrinho[index].quantidade = Number(carrinho[index].quantidade || 1) + mudanca;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinhoCulture', JSON.stringify(carrinho));
    carregarCarrinho();
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoCulture', JSON.stringify(carrinho));
    carregarCarrinho();
}

function atualizarContador() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    const contador = document.getElementById('contador-carrinho');
    if (!contador) return;

    let quantidadeTotal = 0;
    carrinho.forEach(item => {
        quantidadeTotal += Number(item.quantidade) || 0;
    });

    contador.innerText = quantidadeTotal;
}

function obterTotalCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    let total = 0;

    carrinho.forEach(item => {
        const preco = converterPrecoParaNumero(item.preco);
        const quantidade = Number(item.quantidade) || 1;
        total += preco * quantidade;
    });

    return total;
}


function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];

    if (carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio!', 'aviso');
        return;
    }

    const total = obterTotalCarrinho();
    document.getElementById('valor-pagamento').innerText = formatarMoeda(total);
    document.getElementById('modal-pagamento').style.display = 'flex';

    selecionarMetodo('credito');
    calcularParcelamento();
}

function selecionarMetodo(metodo) {
    metodoSelecionado = metodo;

    document.getElementById('btn-pix').classList.remove('ativo');
    document.getElementById('btn-credito').classList.remove('ativo');
    document.getElementById('btn-debito').classList.remove('ativo');

    document.getElementById('btn-' + metodo).classList.add('ativo');

    const areaCartao = document.getElementById('area-cartao');
    const areaPix = document.getElementById('area-pix');

    if (metodo === 'pix') {
        areaCartao.style.display = 'none';
        areaPix.style.display = 'block';
    } else {
        areaCartao.style.display = 'block';
        areaPix.style.display = 'none';

        const campoParcelas = document.getElementById('campo-parcelas');
        if (metodo === 'debito') {
            campoParcelas.style.display = 'none';
        } else {
            campoParcelas.style.display = 'block';
        }
    }
}

function selecionarBandeira(botao, bandeira) {
    document.querySelectorAll('.bandeira').forEach(item => {
        item.classList.remove('ativa');
    });

    botao.classList.add('ativa');
    bandeiraSelecionada = bandeira;
}

function calcularParcelamento() {
    const select = document.getElementById('parcelas');
    if (!select) return;

    const parcelas = Number(select.value);
    const total = obterTotalCarrinho();
    let juros = 0;

    if (parcelas >= 6) {
        juros = (parcelas - 4) * 0.01;
    }

    const totalComJuros = total * (1 + juros);
    const valorParcela = totalComJuros / parcelas;

    document.getElementById('texto-parcela').innerText = parcelas + 'x de';
    document.getElementById('valor-parcela').innerText = formatarMoeda(valorParcela);

    if (parcelas >= 6) {
        document.getElementById('texto-parcela').innerText += ' — juros de ' + (juros * 100).toFixed(0) + '%';
    }
}

function formatarCartao(input) {
    let valor = input.value.replace(/\D/g, '').substring(0, 16);
    let resultado = '';

    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) resultado += ' ';
        resultado += valor[i];
    }
    input.value = resultado;
}

function formatarValidade(input) {
    let valor = input.value.replace(/\D/g, '').substring(0, 4);

    if (valor.length >= 3) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    input.value = valor;
}

function simularPagamento() {
    const status = document.getElementById('status-pagamento');

    if (metodoSelecionado === 'pix') {
        gerarQRCode();
        status.style.color = '#168a35';
        status.innerText = '✓ QR Code fictício gerado para simulação.';
        return;
    }

    const numero = document.getElementById('numero-cartao').value;
    const nome = document.getElementById('nome-cartao').value;
    const validade = document.getElementById('validade-cartao').value;
    const cvv = document.getElementById('cvv-cartao').value;

    if (!bandeiraSelecionada) {
        status.style.color = '#d00000';
        status.innerText = 'Selecione a bandeira do cartão.';
        return;
    }

    if (numero.replace(/\D/g, '').length < 13) {
        status.style.color = '#d00000';
        status.innerText = 'Digite um número de cartão válido para a simulação.';
        return;
    }

    if (!nome.trim()) {
        status.style.color = '#d00000';
        status.innerText = 'Digite o nome do cartão.';
        return;
    }

    if (validade.length !== 5) {
        status.style.color = '#d00000';
        status.innerText = 'Digite a validade no formato MM/AA.';
        return;
    }

    if (cvv.length < 3) {
        status.style.color = '#d00000';
        status.innerText = 'Digite o CVV.';
        return;
    }

    gerarQRCode();
    status.style.color = '#168a35';
    status.innerText = '✓ Pagamento simulado aprovado.';
}

function gerarQRCode() {
    const qrContainer = document.getElementById('qrcode');
    const areaQRCode = document.getElementById('area-qrcode');

    qrContainer.innerHTML = '';
    const total = obterTotalCarrinho();
    const codigo = 'CULTURECOO-SIMULACAO-' + Date.now() + '-' + Math.floor(Math.random() * 999999);

    new QRCode(qrContainer, {
        text: codigo,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    areaQRCode.style.display = 'block';

    const valorQR = document.createElement('p');
    valorQR.style.fontWeight = 'bold';
    valorQR.style.marginTop = '10px';
    valorQR.innerText = 'Valor simulado: ' + formatarMoeda(total);

    qrContainer.appendChild(valorQR);
}

function fecharPagamento() {
    document.getElementById('modal-pagamento').style.display = 'none';
    document.getElementById('area-qrcode').style.display = 'none';
    document.getElementById('status-pagamento').innerText = '';
}

function executarBusca() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim()) {
        alert('Buscando por: ' + termo);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    atualizarTopoUsuario();
    carregarCarrinho();
});

  function atualizarHeaderUsuario() {
        const areaLogin = document.getElementById('area-login-topo');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        if (areaLogin && usuarioLogado && usuarioLogado.nome) {
            const primeiroNome = usuarioLogado.nome.split(' ')[0];
            const paginaDestino = usuarioLogado.email === 'admin@loja.com' ? 'admin.html' : 'minha-conta.html';

            areaLogin.href = paginaDestino;
            areaLogin.innerHTML = `
                <span class="icon-user">👤</span>
                <div class="account-text">
                    <strong style="color: #ffffff;">Olá, ${primeiroNome}!</strong>
                    <small style="color: #cccccc;">Minha Conta</small>
                </div>
            `;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        atualizarHeaderUsuario();
    });