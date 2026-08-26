function atualizarTopoUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const areaLoginTopo = document.getElementById('area-login-topo');

    if (areaLoginTopo && usuarioLogado && usuarioLogado.nome) {
        const primeiroNome = usuarioLogado.nome.split(' ')[0];
        areaLoginTopo.href = 'minha-conta.html';
        areaLoginTopo.innerHTML = `
            <span class="icon-user">👤</span>
            <div class="account-text">
             <strong style="color: #ffffff;">Olá, ${primeiroNome}!</strong>
                    <small style="color: #cccccc;">Minha Conta</small>
            </div>
        `;
    }
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    const contador = document.getElementById('contador-carrinho');
    if (!contador) return;

    let quantidadeTotal = 0;
    carrinho.forEach(item => {
        quantidadeTotal += Number(item.quantidade) || 1;
    });

    contador.innerText = quantidadeTotal;
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function carregarPedidos() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const container = document.getElementById('lista-pedidos');

    if (!container) return;

    if (!usuarioLogado) {
        container.innerHTML = `
            <div class="sem-pedidos">
                <p>Você precisa estar logado para ver seus pedidos.</p>
                <a href="login.html" class="btn-primary" style="display: inline-block; width: auto; margin-top: 15px;">Fazer Login</a>
            </div>
        `;
        return;
    }

    const pedidosGerais = JSON.parse(localStorage.getItem('pedidosCulture')) || [];
    const meusPedidos = pedidosGerais.filter(pedido => pedido.emailUsuario === usuarioLogado.email);

    if (meusPedidos.length === 0) {
        container.innerHTML = `
            <div class="sem-pedidos">
                <p>Você ainda não realizou nenhum pedido.</p>
                <a href="index.html" class="btn-primary" style="display: inline-block; width: auto; margin-top: 15px;">Explorar Loja</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    meusPedidos.reverse().forEach(pedido => {
        let itensHTML = '';

        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(item => {
                itensHTML += `
                    <div class="item-pedido">
                        <img src="${item.imagem || 'imagens/placeholder.png'}" alt="${item.nome}" width="60">
                        <div class="info-item-pedido">
                            <strong>${item.nome}</strong>
                            <span>Qtd: ${item.quantidade || 1} x ${formatarMoeda(Number(item.preco) || 0)}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="card-pedido">
                <div class="cabecalho-pedido">
                    <div>
                        <strong>Pedido #${pedido.id || 'N/A'}</strong>
                        <br>
                        <small>Data: ${pedido.data || 'N/A'}</small>
                    </div>
                    <span class="status-pedido ${pedido.statusClass || 'status-processando'}">
                        ${pedido.status || 'Em Processamento'}
                    </span>
                </div>
                <div class="corpo-pedido">
                    ${itensHTML}
                </div>
                <div class="rodape-pedido">
                    <span>Total: <strong>${formatarMoeda(Number(pedido.total) || 0)}</strong></span>
                    <span>Pagamento: ${pedido.metodoPagamento || 'Cartão'}</span>
                </div>
            </div>
        `;
    });
}

function executarBusca() {
    const campo = document.getElementById('campo-busca');
    if (campo && campo.value.trim()) {
        window.location.href = `produtos.html?busca=${encodeURIComponent(campo.value.trim())}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarTopoUsuario();
    atualizarContadorCarrinho();
    carregarPedidos();
});