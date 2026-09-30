document.addEventListener('DOMContentLoaded', () => {
    const navUsuario = document.getElementById('nav-usuario');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (navUsuario) {
        if (usuarioLogado && usuarioLogado.nome) {
            const primeiroNome = usuarioLogado.nome.split(' ')[0];
            const destino = usuarioLogado.email === 'admin@loja.com' ? 'admin.html' : 'minha-conta.html';
            const fotoSalva = localStorage.getItem('avatar_' + usuarioLogado.email) || localStorage.getItem('userFoto');

            if (fotoSalva) {
                navUsuario.innerHTML = `
                    <a href="${destino}" title="Minha Conta (${primeiroNome})" class="account-link">
                        <img src="${fotoSalva}" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid var(--cor-destaque);">
                    </a>
                `;
            } else {
                navUsuario.innerHTML = `
                    <a href="${destino}" title="Minha Conta (${primeiroNome})" class="account-link">
                        <span class="icon-user">👤</span>
                    </a>
                `;
            }
        } else {
            navUsuario.innerHTML = `
                <a href="login.html" title="Entrar ou Cadastrar" class="account-link">
                    <span class="icon-user">👤</span>
                </a>
            `;
        }
    }
});