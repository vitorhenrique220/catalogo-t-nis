document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    const emailKey = usuarioLogado.email || 'usuario';

    const elHeaderNome = document.getElementById('user-nome-header');
    const elHeaderEmail = document.getElementById('user-email-header');
    const elSidebarUserName = document.getElementById('sidebar-user-name');
    const elSidebarAvatarMini = document.getElementById('sidebar-avatar-mini');
    const elInputNome = document.getElementById('input-nome');
    const elInputEmail = document.getElementById('input-email');
    const elInputTelefone = document.getElementById('input-telefone');
    const elInputCpf = document.getElementById('input-cpf');
    const elInputNascimento = document.getElementById('input-nascimento');
    const elSelectGenero = document.getElementById('select-genero');
    const elSelectCalcado = document.getElementById('select-calcado');
    const elSelectRoupa = document.getElementById('select-roupa');

    const elAvatarCircle = document.getElementById('user-avatar');
    const avatarImg = document.getElementById('avatar-img');
    const btnRemoverAvatar = document.getElementById('btn-remover-avatar');
    const uploadInput = document.getElementById('upload-avatar');

    const displayAddressName = document.getElementById('display-address-name');
    const displayAddressFull = document.getElementById('display-address-full');
    const displayAddressPhone = document.getElementById('display-address-phone');
    const cardholderName = document.getElementById('cardholder-name');

    const nome = usuarioLogado.nome || 'Membro';
    const email = usuarioLogado.email || 'Não informado';
    const telefone = usuarioLogado.telefone || localStorage.getItem(`telefone_${emailKey}`) || '';
    const cpf = usuarioLogado.cpf || localStorage.getItem(`cpf_${emailKey}`) || '';
    const nascimento = usuarioLogado.nascimento || localStorage.getItem(`nascimento_${emailKey}`) || '';
    const genero = usuarioLogado.genero || localStorage.getItem(`genero_${emailKey}`) || 'streetwear';
    const calcado = usuarioLogado.calcado || localStorage.getItem(`calcado_${emailKey}`) || '41';
    const roupa = usuarioLogado.roupa || localStorage.getItem(`roupa_${emailKey}`) || 'M';
    const endereco = usuarioLogado.endereco || localStorage.getItem(`endereco_${emailKey}`) || 'Rua das Flores, 120 - Centro, Curitiba - PR';
    const pixSalvo = localStorage.getItem(`pix_${emailKey}`) || email;

    const inputPix = document.getElementById('input-pix');
    if (inputPix) inputPix.value = pixSalvo;

    const primeiroNome = nome.split(' ')[0] || 'Membro';
    if (elHeaderNome) elHeaderNome.textContent = `Olá, ${nome}`;
    if (elHeaderEmail) elHeaderEmail.textContent = email;
    if (elSidebarUserName) elSidebarUserName.textContent = nome;
    if (cardholderName) cardholderName.textContent = nome.toUpperCase();

    if (elInputNome) elInputNome.value = nome;
    if (elInputEmail) elInputEmail.value = email;
    if (elInputTelefone) elInputTelefone.value = telefone;
    if (elInputCpf) elInputCpf.value = cpf;
    if (elInputNascimento) elInputNascimento.value = nascimento;
    if (elSelectGenero) elSelectGenero.value = genero;
    if (elSelectCalcado) elSelectCalcado.value = calcado;
    if (elSelectRoupa) elSelectRoupa.value = roupa;

    if (displayAddressName) displayAddressName.textContent = nome;
    if (displayAddressFull) displayAddressFull.textContent = endereco;
    if (displayAddressPhone) displayAddressPhone.textContent = `Tel: ${telefone || '(41) 99999-9999'}`;

    if (elAvatarCircle) {
        elAvatarCircle.textContent = primeiroNome.charAt(0).toUpperCase();
    }

    const fotoSalva = localStorage.getItem(`avatar_${emailKey}`) || localStorage.getItem('userFoto');
    if (fotoSalva && avatarImg && elAvatarCircle) {
        avatarImg.src = fotoSalva;
        avatarImg.style.display = 'block';
        elAvatarCircle.style.display = 'none';
        if (btnRemoverAvatar) btnRemoverAvatar.style.display = 'flex';
        if (elSidebarAvatarMini) {
            elSidebarAvatarMini.innerHTML = `<img src="${fotoSalva}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">`;
        }
    }

    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    mostrarAlertaPerfil('A foto deve ter no máximo 2MB.', 'erro');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    localStorage.setItem(`avatar_${emailKey}`, base64Image);
                    localStorage.setItem('userFoto', base64Image);

                    if (avatarImg && elAvatarCircle) {
                        avatarImg.src = base64Image;
                        avatarImg.style.display = 'block';
                        elAvatarCircle.style.display = 'none';
                    }
                    if (btnRemoverAvatar) {
                        btnRemoverAvatar.style.display = 'flex';
                    }
                    if (elSidebarAvatarMini) {
                        elSidebarAvatarMini.innerHTML = `<img src="${base64Image}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">`;
                    }
                    mostrarAlertaPerfil('Foto de perfil atualizada!', 'sucesso');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemoverAvatar) {
        btnRemoverAvatar.addEventListener('click', () => {
            localStorage.removeItem(`avatar_${emailKey}`);
            localStorage.removeItem('userFoto');
            if (avatarImg) {
                avatarImg.src = '';
                avatarImg.style.display = 'none';
            }
            if (elAvatarCircle) {
                elAvatarCircle.style.display = 'flex';
            }
            btnRemoverAvatar.style.display = 'none';
            if (uploadInput) uploadInput.value = '';
            if (elSidebarAvatarMini) elSidebarAvatarMini.textContent = '👤';
            mostrarAlertaPerfil('Foto de perfil removida.', 'sucesso');
        });
    }

    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoNome = elInputNome.value.trim();
            const novoTelefone = elInputTelefone.value.trim();
            const novoCpf = elInputCpf.value.trim();
            const novoNascimento = elInputNascimento.value;
            const novoGenero = elSelectGenero.value;
            const novoCalcado = elSelectCalcado.value;
            const novoRoupa = elSelectRoupa.value;

            if (!novoNome) {
                mostrarAlertaPerfil('Por favor, informe seu nome completo.', 'erro');
                return;
            }

            usuarioLogado.nome = novoNome;
            usuarioLogado.telefone = novoTelefone;
            usuarioLogado.cpf = novoCpf;
            usuarioLogado.nascimento = novoNascimento;
            usuarioLogado.genero = novoGenero;
            usuarioLogado.calcado = novoCalcado;
            usuarioLogado.roupa = novoRoupa;

            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            localStorage.setItem(`telefone_${emailKey}`, novoTelefone);
            localStorage.setItem(`cpf_${emailKey}`, novoCpf);
            localStorage.setItem(`nascimento_${emailKey}`, novoNascimento);
            localStorage.setItem(`genero_${emailKey}`, novoGenero);
            localStorage.setItem(`calcado_${emailKey}`, novoCalcado);
            localStorage.setItem(`roupa_${emailKey}`, novoRoupa);

            const usuarios = JSON.parse(localStorage.getItem('usuariosCulture')) || [];
            const idx = usuarios.findIndex(u => u.email === usuarioLogado.email);
            if (idx !== -1) {
                usuarios[idx].nome = novoNome;
                usuarios[idx].telefone = novoTelefone;
                usuarios[idx].cpf = novoCpf;
                usuarios[idx].nascimento = novoNascimento;
                usuarios[idx].genero = novoGenero;
                usuarios[idx].calcado = novoCalcado;
                usuarios[idx].roupa = novoRoupa;
                localStorage.setItem('usuariosCulture', JSON.stringify(usuarios));
            }

            const pNome = novoNome.split(' ')[0] || 'Membro';
            if (elHeaderNome) elHeaderNome.textContent = `Olá, ${novoNome}`;
            if (elSidebarUserName) elSidebarUserName.textContent = novoNome;
            if (cardholderName) cardholderName.textContent = novoNome.toUpperCase();
            if (displayAddressName) displayAddressName.textContent = novoNome;
            if (displayAddressPhone) displayAddressPhone.textContent = `Tel: ${novoTelefone}`;

            mostrarAlertaPerfil('Dados atualizados com sucesso!', 'sucesso');
        });
    }

    const formEndereco = document.getElementById('form-endereco');
    if (formEndereco) {
        formEndereco.addEventListener('submit', (e) => {
            e.preventDefault();
            const cep = document.getElementById('input-cep').value.trim();
            const rua = document.getElementById('input-rua').value.trim();
            const num = document.getElementById('input-numero').value.trim();
            const bairro = document.getElementById('input-bairro').value.trim();
            const cidade = document.getElementById('input-cidade').value.trim();
            const estado = document.getElementById('input-estado').value.trim().toUpperCase();

            const fullEndereco = `${rua}, ${num} - ${bairro}, ${cidade} - ${estado}, ${cep}`;
            usuarioLogado.endereco = fullEndereco;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            localStorage.setItem(`endereco_${emailKey}`, fullEndereco);

            if (displayAddressFull) displayAddressFull.textContent = fullEndereco;
            alert('Endereço principal atualizado com sucesso!');
        });
    }

    const formSenha = document.getElementById('form-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            e.preventDefault();
            const novaSenha = document.getElementById('input-nova-senha').value;
            const confSenha = document.getElementById('input-confirmar-senha').value;

            if (novaSenha.length < 6) {
                alert('A nova senha deve ter no mínimo 6 caracteres.');
                return;
            }

            if (novaSenha !== confSenha) {
                alert('As senhas não coincidem.');
                return;
            }

            usuarioLogado.senha = novaSenha;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

            const usuarios = JSON.parse(localStorage.getItem('usuariosCulture')) || [];
            const idx = usuarios.findIndex(u => u.email === usuarioLogado.email);
            if (idx !== -1) {
                usuarios[idx].senha = novaSenha;
                localStorage.setItem('usuariosCulture', JSON.stringify(usuarios));
            }

            alert('Senha atualizada com sucesso!');
            formSenha.reset();
        });
    }

    function mostrarAlertaPerfil(msg, tipo) {
        const alerta = document.getElementById('alerta-perfil');
        if (!alerta) return;
        alerta.textContent = msg;
        alerta.className = `alerta-perfil alerta-${tipo}`;
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3500);
    }

    renderizarPedidos(usuarioLogado.email);

    const carrinho = JSON.parse(localStorage.getItem('carrinhoCulture')) || [];
    const totalCarrinhoEl = document.getElementById('total-carrinho');
    if (totalCarrinhoEl) {
        const qtdItens = carrinho.reduce((acc, item) => acc + (Number(item.quantidade) || 1), 0);
        totalCarrinhoEl.textContent = qtdItens;
    }

    if (usuarioLogado.email === 'admin@loja.com') {
        const tagAdmin = document.getElementById('tag-admin');
        const tagMember = document.getElementById('tag-member');
        const btnAdmin = document.getElementById('btn-painel-admin');

        if (tagAdmin) tagAdmin.style.display = 'inline-block';
        if (tagMember) tagMember.style.display = 'none';
        if (btnAdmin) btnAdmin.style.display = 'flex';
    }

    const navButtons = document.querySelectorAll('.account-nav-btn[data-tab]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');
            ativarAba(tabTarget);
        });
    });

    const btnAbrirModalSair = document.getElementById('btn-abrir-modal-sair');
    const modalSair = document.getElementById('modal-confirmar-sair');
    const btnCancelarSair = document.getElementById('btn-cancelar-sair');
    const btnConfirmarSair = document.getElementById('btn-confirmar-sair');

    if (btnAbrirModalSair && modalSair) {
        btnAbrirModalSair.addEventListener('click', () => {
            modalSair.style.display = 'flex';
        });

        if (btnCancelarSair) {
            btnCancelarSair.addEventListener('click', () => {
                modalSair.style.display = 'none';
            });
        }

        if (btnConfirmarSair) {
            btnConfirmarSair.addEventListener('click', () => {
                localStorage.removeItem('usuarioLogado');
                window.location.href = 'index.html';
            });
        }

        modalSair.addEventListener('click', (e) => {
            if (e.target === modalSair) {
                modalSair.style.display = 'none';
            }
        });
    }
});

function ativarAba(tabName) {
    const tabPanels = document.querySelectorAll('.account-tab-panel');
    const navButtons = document.querySelectorAll('.account-nav-btn[data-tab]');

    tabPanels.forEach(panel => panel.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    const targetPanel = document.getElementById(`tab-${tabName}`);
    const targetBtn = document.querySelector(`.account-nav-btn[data-tab="${tabName}"]`);

    if (targetPanel) targetPanel.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
}

function renderizarPedidos(emailUsuario) {
    const container = document.getElementById('lista-pedidos-container');
    const totalPedidosEl = document.getElementById('total-pedidos');
    if (!container) return;

    const pedidosGerais = JSON.parse(localStorage.getItem('pedidosCulture')) || [];
    let meusPedidos = pedidosGerais.filter(p => p.emailUsuario === emailUsuario);

    if (totalPedidosEl) {
        totalPedidosEl.textContent = meusPedidos.length > 0 ? meusPedidos.length : 2;
    }

    if (meusPedidos.length === 0) {
        container.innerHTML = `
            <div class="order-fashion-card">
                <div class="order-card-header">
                    <div class="order-id-date">
                        <span class="order-id">Pedido #CT-9481</span>
                        <span class="order-date">28/09/2026</span>
                    </div>
                    <span class="order-status-badge status-transporte">🚚 Em Transporte</span>
                </div>
                <div class="order-card-body">
                    <div class="order-items-preview">
                        <img src="imagens/air max 95.webp" alt="Nike Air Max 95" class="order-thumb">
                        <img src="https://acdn-us.mitiendanube.com/stores/003/950/561/products/1244c67c-c1f7-4aa8-9937-7db0971d4195-989f714524d248ede117141714578241-1024-1024.jpeg" alt="Polo Ralph Lauren" class="order-thumb">
                        <div class="order-item-desc">
                            <strong>Nike Air Max 95 Yugioh + Camiseta Polo</strong>
                            <small>2 itens • Tamanho 41 / M</small>
                        </div>
                    </div>
                    <div class="order-card-total">
                        <span>Total Pago</span>
                        <strong>R$ 1.260,90</strong>
                    </div>
                </div>
                <div class="order-tracking-bar">
                    <span class="track-step done">✓ Pedido Confirmado</span>
                    <span class="track-step done">✓ Em Separação</span>
                    <span class="track-step done">🚚 A Caminho</span>
                    <span class="track-step">🏁 Entregue</span>
                </div>
            </div>

            <div class="order-fashion-card">
                <div class="order-card-header">
                    <div class="order-id-date">
                        <span class="order-id">Pedido #CT-8120</span>
                        <span class="order-date">14/08/2026</span>
                    </div>
                    <span class="order-status-badge status-entregue">✓ Entregue</span>
                </div>
                <div class="order-card-body">
                    <div class="order-items-preview">
                        <img src="imagens/shox 12 molas.avif" alt="Nike Shox TL" class="order-thumb">
                        <div class="order-item-desc">
                            <strong>Nike Shox TL 12 Molas</strong>
                            <small>1 item • Tamanho 41</small>
                        </div>
                    </div>
                    <div class="order-card-total">
                        <span>Total Pago</span>
                        <strong>R$ 899,90</strong>
                    </div>
                </div>
                <div class="order-tracking-bar">
                    <span class="track-step done">✓ Pedido Confirmado</span>
                    <span class="track-step done">✓ Em Separação</span>
                    <span class="track-step done">✓ Transporte</span>
                    <span class="track-step done">🏁 Entregue em 16/08</span>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = meusPedidos.map(p => {
        const itensHTML = (p.itens || []).map(item => `
            <img src="${item.imagem || 'imagens/logo.png'}" alt="${item.nome}" class="order-thumb">
        `).join('');

        const totalFormatted = typeof p.total === 'number' ? `R$ ${p.total.toFixed(2).replace('.', ',')}` : (p.total || 'R$ 0,00');

        return `
            <div class="order-fashion-card">
                <div class="order-card-header">
                    <div class="order-id-date">
                        <span class="order-id">Pedido #${p.id || 'CT-' + Math.floor(1000 + Math.random() * 9000)}</span>
                        <span class="order-date">${p.data || 'Hoje'}</span>
                    </div>
                    <span class="order-status-badge status-processando">${p.status || 'Processando'}</span>
                </div>
                <div class="order-card-body">
                    <div class="order-items-preview">
                        ${itensHTML}
                        <div class="order-item-desc">
                            <strong>${(p.itens || []).map(i => i.nome).join(', ') || 'Produtos Culture'}</strong>
                            <small>${(p.itens || []).length} item(ns)</small>
                        </div>
                    </div>
                    <div class="order-card-total">
                        <span>Total</span>
                        <strong>${totalFormatted}</strong>
                    </div>
                </div>
                <div class="order-tracking-bar">
                    <span class="track-step done">✓ Pedido Criado</span>
                    <span class="track-step done">✓ Pagamento Aprovado</span>
                    <span class="track-step">🚚 Em Preparação</span>
                    <span class="track-step">🏁 Entrega</span>
                </div>
            </div>
        `;
    }).join('');
}

function copiarCupom(codigo, btnElement) {
    navigator.clipboard.writeText(codigo).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = 'Copiado! ✓';
        btnElement.style.background = '#16a34a';
        btnElement.style.borderColor = '#16a34a';
        btnElement.style.color = '#ffffff';

        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.background = '';
            btnElement.style.borderColor = '';
            btnElement.style.color = '';
        }, 2000);
    }).catch(() => {
        alert('Código do cupom: ' + codigo);
    });
}

function salvarPix() {
    const inputPix = document.getElementById('input-pix');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (inputPix && usuarioLogado) {
        const chave = inputPix.value.trim();
        const emailKey = usuarioLogado.email || 'usuario';
        localStorage.setItem(`pix_${emailKey}`, chave);
        alert('Chave PIX salva com sucesso!');
    }
}