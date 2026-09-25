/**
 * mobile.js — Menu hambúrguer, busca mobile e ajustes para celular.
 * Funciona em todas as páginas do projeto.
 */

(function () {
    'use strict';

    function iniciarMenuMobile() {
        const header = document.querySelector('.topo-site');
        if (!header) return;

        const navBar = header.querySelector('.header-nav-bar');
        const headerRow = header.querySelector('.header-main-row');
        if (!navBar || !headerRow) return;

        // Evitar duplicação ao recarregar
        if (document.getElementById('btn-hamburger')) return;

        // ─── Botão de busca mobile (ícone de lupa) ────────────────────────────
        const btnBusca = document.createElement('button');
        btnBusca.id = 'btn-busca-mobile';
        btnBusca.setAttribute('aria-label', 'Buscar');
        btnBusca.innerHTML = '🔍';

        // ─── Botão hambúrguer (3 linhas → X) ─────────────────────────────────
        const btnHamburger = document.createElement('button');
        btnHamburger.id = 'btn-hamburger';
        btnHamburger.setAttribute('aria-label', 'Abrir menu');
        btnHamburger.setAttribute('aria-expanded', 'false');
        btnHamburger.innerHTML = '<span></span><span></span><span></span>';

        // Insere na ordem certa: busca → hamburger (à direita do header)
        headerRow.appendChild(btnBusca);
        headerRow.appendChild(btnHamburger);

        // ─── Overlay escuro do menu ───────────────────────────────────────────
        const overlay = document.createElement('div');
        overlay.id = 'menu-mobile-overlay';
        document.body.appendChild(overlay);

        // ─── Lógica: abrir/fechar menu ────────────────────────────────────────
        function abrirMenu() {
            navBar.classList.add('menu-aberto');
            btnHamburger.classList.add('ativo');
            btnHamburger.setAttribute('aria-expanded', 'true');
            overlay.classList.add('visivel');
            document.body.style.overflow = 'hidden';
        }

        function fecharMenu() {
            navBar.classList.remove('menu-aberto');
            btnHamburger.classList.remove('ativo');
            btnHamburger.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('visivel');
            document.body.style.overflow = '';
        }

        btnHamburger.addEventListener('click', () => {
            navBar.classList.contains('menu-aberto') ? fecharMenu() : abrirMenu();
        });

        overlay.addEventListener('click', fecharMenu);

        // Fecha ao clicar num link dentro do menu
        navBar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', fecharMenu);
        });

        // ESC fecha o menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fecharMenu();
                fecharBusca();
            }
        });

        // ─── Lógica: abrir/fechar barra de busca mobile ───────────────────────
        const searchBox = document.querySelector('.search-box');
        const campoBusca = document.getElementById('campo-busca');

        function abrirBusca() {
            if (!searchBox) return;
            searchBox.classList.add('busca-aberta');
            if (campoBusca) campoBusca.focus();
            btnBusca.innerHTML = '✕';
            btnBusca.setAttribute('aria-label', 'Fechar busca');
        }

        function fecharBusca() {
            if (!searchBox) return;
            searchBox.classList.remove('busca-aberta');
            if (campoBusca) campoBusca.value = '';
            btnBusca.innerHTML = '🔍';
            btnBusca.setAttribute('aria-label', 'Buscar');
            // Fecha o dropdown de resultados se existir
            const dropdown = document.getElementById('busca-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        }

        btnBusca.addEventListener('click', () => {
            searchBox?.classList.contains('busca-aberta') ? fecharBusca() : abrirBusca();
        });

        // Fecha a busca ao clicar fora
        document.addEventListener('click', (e) => {
            if (
                searchBox &&
                searchBox.classList.contains('busca-aberta') &&
                !searchBox.contains(e.target) &&
                e.target !== btnBusca
            ) {
                fecharBusca();
            }
        });

        // ─── Garante que em desktop a searchBox sempre esteja visível ─────────
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && searchBox) {
                searchBox.classList.remove('busca-aberta');
                searchBox.style.display = '';
                fecharMenu();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarMenuMobile);
    } else {
        iniciarMenuMobile();
    }
})();
