

(function () {
    'use strict';

    const PAGINAS_PRODUTO = [
        'tenis.html',
        'blusas-jaquetas.html',
        'camisas.html',
        'calcas-shorts.html',
        'index.html',
    ];

    function coletarProdutosDOM() {
        const produtos = [];
        const seletoresCard = [
            '.tenis-card',
            '.card',
            '.produto-card',
            '.item-card',
            '.blusa-card',
            '.camisa-card',
            '.calca-card',
        ];

        seletoresCard.forEach(sel => {
            document.querySelectorAll(sel).forEach(card => {
                const nome =
                    card.querySelector('h4')?.innerText?.trim() ||
                    card.querySelector('h3')?.innerText?.trim() ||
                    '';
                const precoEl =
                    card.querySelector('.tenis-preco') ||
                    card.querySelector('.preco') ||
                    card.querySelector('[class*="preco"]');
                const preco = precoEl?.innerText?.trim() || '';
                const img = card.querySelector('img')?.src || '';

                if (nome && !produtos.find(p => p.nome === nome)) {
                    produtos.push({ nome, preco, img, card });
                }
            });
        });

        return produtos;
    }

    function criarDropdown(input) {
        let dropdown = document.getElementById('busca-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'busca-dropdown';
            document.body.appendChild(dropdown);
        }
        return dropdown;
    }

    function posicionarDropdown(input, dropdown) {
        const rect = input.closest('.search-box').getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = Math.max(rect.width, 320) + 'px';
    }

    function esconderDropdown() {
        const d = document.getElementById('busca-dropdown');
        if (d) d.style.display = 'none';
    }

    function renderizarResultados(termo, produtos, input) {
        const dropdown = criarDropdown(input);
        posicionarDropdown(input, dropdown);

        if (!termo || termo.length < 2) {
            dropdown.style.display = 'none';
            return;
        }

        const termoLower = termo.toLowerCase();
        const encontrados = produtos.filter(p =>
            p.nome.toLowerCase().includes(termoLower)
        );

        if (encontrados.length === 0) {
            dropdown.innerHTML = `
                <div class="busca-vazio">
                    <span>😕</span>
                    <p>Nenhum produto encontrado para "<strong>${termo}</strong>"</p>
                </div>`;
            dropdown.style.display = 'block';
            return;
        }

        dropdown.innerHTML = `
            <div class="busca-header-results">
                ${encontrados.length} resultado${encontrados.length > 1 ? 's' : ''} para "<strong>${termo}</strong>"
            </div>`;

        const lista = document.createElement('ul');
        lista.className = 'busca-lista';

        encontrados.slice(0, 8).forEach(produto => {
            const li = document.createElement('li');
            li.className = 'busca-item';
            li.innerHTML = `
                <img src="${produto.img}" alt="${produto.nome}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'40\\' height=\\'40\\' fill=\\'%23222\\'/></svg>'">
                <div class="busca-item-info">
                    <span class="busca-item-nome">${destacarTermo(produto.nome, termo)}</span>
                    <span class="busca-item-preco">${produto.preco}</span>
                </div>
                <button class="busca-item-btn" title="Adicionar ao carrinho">🛒</button>
            `;

            li.querySelector('.busca-item-info').addEventListener('click', () => {
                esconderDropdown();
                input.value = '';
                if (produto.card) {
                    produto.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    produto.card.classList.add('busca-highlight');
                    setTimeout(() => produto.card.classList.remove('busca-highlight'), 2000);
                }
            });

            li.querySelector('.busca-item-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                adicionarAoCarrinhoBusca(produto.nome, produto.preco, produto.img);
                li.querySelector('.busca-item-btn').textContent = '✓';
                li.querySelector('.busca-item-btn').style.color = '#00cc66';
                setTimeout(() => {
                    li.querySelector('.busca-item-btn').textContent = '🛒';
                    li.querySelector('.busca-item-btn').style.color = '';
                }, 1500);
            });

            lista.appendChild(li);
        });

        dropdown.appendChild(lista);

        if (encontrados.length > 8) {
            const mais = document.createElement('div');
            mais.className = 'busca-ver-mais';
            mais.textContent = `+ ${encontrados.length - 8} resultados — pressione Enter para ver todos`;
            dropdown.appendChild(mais);
        }

        dropdown.style.display = 'block';
    }

    function destacarTermo(nome, termo) {
        const regex = new RegExp(`(${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return nome.replace(regex, '<mark>$1</mark>');
    }

    function adicionarAoCarrinhoBusca(nome, preco, imagem) {
        let carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
        const existente = carrinho.find(i => i.nome === nome);

        if (existente) {
            existente.quantidade += 1;
        } else {
            carrinho.push({ nome, preco, imagem, quantidade: 1 });
        }

        localStorage.setItem('carrinhoCulture', JSON.stringify(carrinho));

        const contador = document.getElementById('contador-carrinho');
        if (contador) {
            const total = carrinho.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);
            contador.innerText = total;
        }

        mostrarToastBusca(`"${nome}" adicionado ao carrinho!`);
    }

    function mostrarToastBusca(msg) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span style="color:#00cc66;font-weight:bold;margin-right:6px;">✓</span>${msg}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function executarBusca() {
        const input = document.getElementById('campo-busca');
        const termo = input?.value?.trim();
        if (!termo) return;

        sessionStorage.setItem('termoBusca', termo);

        const produtos = coletarProdutosDOM();
        const encontrado = produtos.find(p =>
            p.nome.toLowerCase().includes(termo.toLowerCase())
        );

        if (encontrado && encontrado.card) {
            esconderDropdown();
            encontrado.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            encontrado.card.classList.add('busca-highlight');
            setTimeout(() => encontrado.card.classList.remove('busca-highlight'), 2500);
        } else {

            window.location.href = `tenis.html?busca=${encodeURIComponent(termo)}`;
        }
    }

    function init() {
        const input = document.getElementById('campo-busca');
        if (!input) return;

        const searchBox = input.closest('.search-box');
        if (searchBox) {

            const btn = searchBox.querySelector('.search-btn');
            if (btn) {
                btn.removeAttribute('onclick');
                btn.addEventListener('click', executarBusca);
            }
        }

        let produtos = [];
        setTimeout(() => {
            produtos = coletarProdutosDOM();
        }, 300);

        window.addEventListener('load', () => {
            setTimeout(() => { produtos = coletarProdutosDOM(); }, 500);
        });

        input.addEventListener('input', () => {
            if (produtos.length === 0) produtos = coletarProdutosDOM();
            renderizarResultados(input.value.trim(), produtos, input);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                esconderDropdown();
                executarBusca();
            }
            if (e.key === 'Escape') {
                esconderDropdown();
                input.value = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box') && !e.target.closest('#busca-dropdown')) {
                esconderDropdown();
            }
        });

        window.addEventListener('resize', () => {
            const d = document.getElementById('busca-dropdown');
            if (d && d.style.display !== 'none') {
                posicionarDropdown(input, d);
            }
        });

        const params = new URLSearchParams(window.location.search);
        const termoBusca = params.get('busca') || sessionStorage.getItem('termoBusca');
        if (termoBusca) {
            sessionStorage.removeItem('termoBusca');
            input.value = termoBusca;
            setTimeout(() => {
                produtos = coletarProdutosDOM();
                renderizarResultados(termoBusca, produtos, input);

                const primeiro = produtos.find(p =>
                    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
                );
                if (primeiro?.card) {
                    primeiro.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    primeiro.card.classList.add('busca-highlight');
                    setTimeout(() => primeiro.card.classList.remove('busca-highlight'), 2500);
                }
            }, 600);
        }
    }

    window.executarBusca = executarBusca;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
