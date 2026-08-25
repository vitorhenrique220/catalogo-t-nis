document.addEventListener('DOMContentLoaded', () => {
    const navUsuario = document.getElementById('nav-usuario');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (navUsuario) {
        if (usuarioLogado && usuarioLogado.nome) {
           
            const primeiroNome = usuarioLogado.nome.split(' ')[0];

            navUsuario.innerHTML = `
                <a href="minha-conta.html" style="color: #ffffff; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; background-color: #0088ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem; color: #ffffff;">
                        ${primeiroNome.charAt(0).toUpperCase()}
                    </div>
                    <div style="text-align: left; line-height: 1.2;">
                        <span style="font-size: 0.85rem; color: #ffffff;">Olá, <strong style="color: #0088ff;">${primeiroNome}</strong></span><br>
                        <span style="font-size: 0.75rem; color: #a1a1aa;">Minha Conta</span>
                    </div>
                </a>
            `;
        } else {
           
            navUsuario.innerHTML = `
                <a href="login.html" style="color: #ffffff; text-decoration: none; font-size: 0.85rem; text-align: left; line-height: 1.2;">
                    <strong>Olá! Faça login</strong><br>
                    <span style="color: #a1a1aa; font-size: 0.75rem;">Ou cadastre-se</span>
                </a>
            `;
        }
    }
});