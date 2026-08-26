document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }


    const areaLoginTopo = document.getElementById('area-login-topo');
    if (areaLoginTopo && usuarioLogado.nome) {
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

  
    const elNome = document.getElementById('user-nome');
    const elEmail = document.getElementById('user-email');
    const elHeaderNome = document.getElementById('user-nome-header');
    const elAvatarCircle = document.getElementById('user-avatar');

    const nomeUsuario = usuarioLogado.nome || 'Não informado';
    const emailUsuario = usuarioLogado.email || 'Não informado';

    if (elNome) elNome.textContent = nomeUsuario;
    if (elEmail) elEmail.textContent = emailUsuario;
    if (elHeaderNome) elHeaderNome.textContent = nomeUsuario;


    if (elAvatarCircle && usuarioLogado.nome) {
        elAvatarCircle.textContent = usuarioLogado.nome.charAt(0).toUpperCase();
    }

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

   
    if (usuarioLogado.email === 'admin@loja.com') {
        const tagAdmin = document.getElementById('tag-admin');
        const btnAdmin = document.getElementById('btn-painel-admin');

        if (tagAdmin) tagAdmin.style.display = 'inline-block';
        if (btnAdmin) btnAdmin.style.display = 'block';
    }


    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});

const uploadInput = document.getElementById('upload-avatar');
const avatarImg = document.getElementById('avatar-img');
const userAvatar = document.getElementById('user-avatar');
const btnRemover = document.getElementById('btn-remover-avatar');


document.addEventListener('DOMContentLoaded', () => {
    const fotoSalva = localStorage.getItem('userFoto');
    if (fotoSalva) {
        avatarImg.src = fotoSalva;
        avatarImg.style.display = 'block';
        userAvatar.style.display = 'none';
        btnRemover.style.display = 'flex';
    }
});


uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;
            avatarImg.src = base64Image;
            avatarImg.style.display = 'block';
            userAvatar.style.display = 'none';
            btnRemover.style.display = 'flex';
            
          
            localStorage.setItem('userFoto', base64Image);
        };
        reader.readAsDataURL(file);
    }
});

btnRemover.addEventListener('click', () => {
    avatarImg.src = '';
    avatarImg.style.display = 'none';
    userAvatar.style.display = 'flex';
    btnRemover.style.display = 'none';
    uploadInput.value = '';

    localStorage.removeItem('userFoto');
});