document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // --- 1. ATUALIZA O TOPO DA PÁGINA (HEADER) ---
    const areaLoginTopo = document.getElementById('area-login-topo');
    if (areaLoginTopo && usuarioLogado.nome) {
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

    // --- 2. PREENCHE OS DADOS DO PAINEL MINHA CONTA ---
    const elNome = document.getElementById('user-nome');
    const elEmail = document.getElementById('user-email');
    const elHeaderNome = document.getElementById('user-nome-header');
    const elAvatarCircle = document.getElementById('user-avatar');

    const nomeUsuario = usuarioLogado.nome || 'Não informado';
    const emailUsuario = usuarioLogado.email || 'Não informado';

    if (elNome) elNome.textContent = nomeUsuario;
    if (elEmail) elEmail.textContent = emailUsuario;
    if (elHeaderNome) elHeaderNome.textContent = nomeUsuario;

    // Inicial do nome no Avatar
    if (elAvatarCircle && usuarioLogado.nome) {
        elAvatarCircle.textContent = usuarioLogado.nome.charAt(0).toUpperCase();
    }

    // --- 3. CARREGA E ALTERA FOTO DE PERFIL ---
    const avatarImg = document.getElementById('avatar-img');
    const fotoSalva = localStorage.getItem(`avatar_${usuarioLogado.email}`);
    if (fotoSalva && avatarImg && elAvatarCircle) {
        avatarImg.src = fotoSalva;
        avatarImg.style.display = 'block';
        elAvatarCircle.style.display = 'none';
    }

    const uploadInput = document.getElementById('upload-avatar');
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    localStorage.setItem(`avatar_${usuarioLogado.email}`, base64Image);
                    if (avatarImg && elAvatarCircle) {
                        avatarImg.src = base64Image;
                        avatarImg.style.display = 'block';
                        elAvatarCircle.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 4. PERMISSÕES DE ADMINISTRADOR ---
    if (usuarioLogado.email === 'admin@loja.com') {
        const tagAdmin = document.getElementById('tag-admin');
        const btnAdmin = document.getElementById('btn-painel-admin');

        if (tagAdmin) tagAdmin.style.display = 'inline-block';
        if (btnAdmin) btnAdmin.style.display = 'block';
    }

    // --- 5. BOTAO SAIR (LOGOUT) ---
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});