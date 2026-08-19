document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const errorAlert = document.getElementById('errorAlert');

  
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            eyeIcon.classList.toggle('fa-eye', !isPassword);
            eyeIcon.classList.toggle('fa-eye-slash', isPassword);
        });
    }


    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            hideError();

            
            if (!email || !password) {
                showError('Por favor, preencha todos os campos.');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Por favor, insira um e-mail válido.');
                return;
            }

            
            const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosLojaTenis')) || [];

          
            const eAdmin = (email === 'admin@loja.com' && password === '123456');
            const usuarioEncontrado = usuariosSalvos.find(u => u.email === email && u.senha === password);

            if (eAdmin || usuarioEncontrado) {
               
                const dadosSessao = {
                    nome: eAdmin ? 'Administrador' : usuarioEncontrado.nome,
                    email: email
                };
                
                localStorage.setItem('usuarioLogado', JSON.stringify(dadosSessao));

                showSuccess('Login realizado com sucesso! Redirecionando...');

                
                setTimeout(() => {
                    if (eAdmin) {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'inicio.html';
                    }
                }, 1000);
            } else {
                showError('E-mail ou senha incorretos.');
            }
        });
    }


    function showError(message) {
        if (!errorAlert) return;
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        errorAlert.style.backgroundColor = '#e74c3c';
        errorAlert.style.color = '#ffffff';
        errorAlert.style.padding = '10px';
        errorAlert.style.borderRadius = '6px';
        errorAlert.style.marginBottom = '15px';
        errorAlert.style.textAlign = 'center';
    }

    function showSuccess(message) {
        if (!errorAlert) return;
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        errorAlert.style.backgroundColor = '#2ecc71';
        errorAlert.style.color = '#ffffff';
        errorAlert.style.padding = '10px';
        errorAlert.style.borderRadius = '6px';
        errorAlert.style.marginBottom = '15px';
        errorAlert.style.textAlign = 'center';
    }

    function hideError() {
        if (!errorAlert) return;
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});