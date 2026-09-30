(function () {
    'use strict';

    function inicializarTema() {
        const temaSalvo = localStorage.getItem('temaCulture') || 'claro';
        aplicarTema(temaSalvo);
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        document.body.setAttribute('data-theme', tema);
        localStorage.setItem('temaCulture', tema);

        const botoesTema = document.querySelectorAll('.btn-theme-toggle, #btn-toggle-theme');
        botoesTema.forEach(btn => {
            if (tema === 'escuro') {
                btn.innerHTML = '<span class="theme-icon">☀️</span> <span class="theme-label-text">Claro</span>';
                btn.setAttribute('title', 'Ativar Modo Claro');
                btn.setAttribute('aria-label', 'Ativar Modo Claro');
            } else {
                btn.innerHTML = '<span class="theme-icon">🌙</span> <span class="theme-label-text">Escuro</span>';
                btn.setAttribute('title', 'Ativar Modo Escuro');
                btn.setAttribute('aria-label', 'Ativar Modo Escuro');
            }
        });
    }

    function alternarTema() {
        const temaAtual = localStorage.getItem('temaCulture') || 'claro';
        const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
        aplicarTema(novoTema);
    }

    function atualizarHeaderUsuarioGlobal() {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const accountLinks = document.querySelectorAll('.account-link, #area-login-topo, #user-account-link');
        const drawerUserLinks = document.querySelectorAll('.drawer-user-link');

        accountLinks.forEach(link => {
            if (usuarioLogado && usuarioLogado.nome) {
                const primeiroNome = usuarioLogado.nome.split(' ')[0];
                const destino = usuarioLogado.email === 'admin@loja.com' ? 'admin.html' : 'minha-conta.html';
                link.href = destino;
                link.setAttribute('title', 'Minha Conta (' + primeiroNome + ')');

                const fotoSalva = localStorage.getItem('avatar_' + usuarioLogado.email) || localStorage.getItem('userFoto');
                const avatarHTML = fotoSalva
                    ? '<img src="' + fotoSalva + '" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid var(--cor-destaque); flex-shrink: 0;">'
                    : '<span class="icon-user">👤</span>';

                link.innerHTML = avatarHTML;
            } else {
                link.href = 'login.html';
                link.setAttribute('title', 'Entrar ou Cadastrar');
                link.innerHTML = '<span class="icon-user">👤</span>';
            }
        });

        drawerUserLinks.forEach(link => {
            if (usuarioLogado && usuarioLogado.nome) {
                const primeiroNome = usuarioLogado.nome.split(' ')[0];
                const destino = usuarioLogado.email === 'admin@loja.com' ? 'admin.html' : 'minha-conta.html';
                link.href = destino;
                link.innerHTML = '👤 Minha Conta (' + primeiroNome + ')';
            } else {
                link.href = 'login.html';
                link.innerHTML = '👤 Entrar / Cadastrar';
            }
        });

        const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
        const badges = document.querySelectorAll('.cart-badge, #contador-carrinho');
        const totalItens = carrinho.reduce((acc, item) => acc + (Number(item.quantidade) || 1), 0);
        badges.forEach(badge => badge.innerText = totalItens);
    }

    function garantirEstruturaDrawer() {
        let drawer = document.getElementById('menu-drawer');
        if (!drawer) {
            drawer = document.createElement('aside');
            drawer.id = 'menu-drawer';
            drawer.className = 'menu-drawer-sidebar';
            drawer.innerHTML = `
                <div class="drawer-header">
                    <div class="drawer-logo">
                        <img src="imagens/logo.png" alt="Culture.COO">
                    </div>
                    <button id="btn-fechar-drawer" class="btn-fechar-drawer" aria-label="Fechar Menu">✕</button>
                </div>
                <div class="drawer-body">
                    <div class="drawer-section-title">Categorias</div>
                    <ul class="drawer-links">
                        <li><a href="index.html">🏠 Início</a></li>
                        <li><a href="tenis.html">👟 Tênis</a></li>
                        <li><a href="blusas-jaquetas.html">🧥 Blusas & Jaquetas</a></li>
                        <li><a href="camisas.html">👕 Camisas</a></li>
                        <li><a href="calcas-shorts.html">👖 Calças & Shorts</a></li>
                        <li><a href="contato.html">💬 Suporte & Contato</a></li>
                    </ul>
                    <div class="drawer-section-title">Minha Conta</div>
                    <ul class="drawer-links">
                        <li><a href="login.html" class="drawer-user-link">👤 Entrar / Minha Conta</a></li>
                        <li><a href="carrinho.html">🛒 Meu Carrinho</a></li>
                    </ul>
                    <div class="drawer-footer">
                        <button class="btn-theme-toggle drawer-theme-btn" type="button">
                            <span class="theme-icon">🌙</span>
                            <span class="theme-label-text">Tema</span>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(drawer);
        }

        let overlay = document.getElementById('menu-mobile-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'menu-mobile-overlay';
            document.body.appendChild(overlay);
        }

        return { drawer, overlay };
    }

    function iniciarComponentesHeader() {
        inicializarTema();
        atualizarHeaderUsuarioGlobal();

        const { drawer, overlay } = garantirEstruturaDrawer();
        const btnHamburger = document.getElementById('btn-hamburger') || document.querySelector('.btn-hamburger');
        const btnFecharDrawer = document.getElementById('btn-fechar-drawer');

        const botoesTema = document.querySelectorAll('.btn-theme-toggle, #btn-toggle-theme');
        botoesTema.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                alternarTema();
            };
        });

        function abrirDrawer() {
            drawer.classList.add('menu-aberto');
            if (btnHamburger) {
                btnHamburger.classList.add('ativo');
                btnHamburger.setAttribute('aria-expanded', 'true');
            }
            overlay.classList.add('visivel');
            document.body.style.overflow = 'hidden';
        }

        function fecharDrawer() {
            drawer.classList.remove('menu-aberto');
            if (btnHamburger) {
                btnHamburger.classList.remove('ativo');
                btnHamburger.setAttribute('aria-expanded', 'false');
            }
            overlay.classList.remove('visivel');
            document.body.style.overflow = '';
        }

        if (btnHamburger) {
            btnHamburger.onclick = (e) => {
                e.stopPropagation();
                if (drawer.classList.contains('menu-aberto')) {
                    fecharDrawer();
                } else {
                    abrirDrawer();
                }
            };
        }

        if (btnFecharDrawer) {
            btnFecharDrawer.onclick = fecharDrawer;
        }

        if (overlay) {
            overlay.onclick = fecharDrawer;
        }

        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', fecharDrawer);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fecharDrawer();
            }
        });
    }

    inicializarTema();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarComponentesHeader);
    } else {
        iniciarComponentesHeader();
    }
})();
