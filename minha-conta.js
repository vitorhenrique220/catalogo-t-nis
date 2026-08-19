document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

   
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }


    document.getElementById('user-nome').textContent = usuarioLogado.nome;
    document.getElementById('user-email').textContent = usuarioLogado.email;


    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado'); 
            window.location.href = 'login.html'; 
        });
    }
});