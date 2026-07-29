document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');

  const errorAlert = document.getElementById('errorAlert');
  const successAlert = document.getElementById('successAlert');

  const passwordStrengthDiv = document.getElementById('passwordStrength');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');

 
  document.querySelectorAll('.btn-toggle-pass').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = button.querySelector('i');

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    });
  });

  
  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;

    if (value.length === 0) {
      passwordStrengthDiv.style.display = 'none';
      return;
    }

    passwordStrengthDiv.style.display = 'block';

    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {
      strengthBar.style.width = '33%';
      strengthBar.style.backgroundColor = '#ef4444';
      strengthText.textContent = 'Senha fraca';
      strengthText.style.color = '#fca5a5';
    } else if (score <= 4) {
      strengthBar.style.width = '66%';
      strengthBar.style.backgroundColor = '#f59e0b';
      strengthText.textContent = 'Senha média';
      strengthText.style.color = '#fcd34d';
    } else {
      strengthBar.style.width = '100%';
      strengthBar.style.backgroundColor = '#10b981';
      strengthText.textContent = 'Senha forte';
      strengthText.style.color = '#6ee7b7';
    }
  });

 
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlerts();

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!fullname || !email || !password || !confirmPassword) {
      showError('Por favor, preencha todos os campos.');
      return;
    }

    if (fullname.split(' ').length < 2) {
      showError('Por favor, insira seu nome completo (nome e sobrenome).');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      showError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    if (!termsCheckbox.checked) {
      showError('Você deve aceitar os Termos de Uso para continuar.');
      return;
    }

    
    showSuccess('Cadastro realizado! Redirecionando para a página de login...');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });

  function showError(msg) {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  }

  function showSuccess(msg) {
    successAlert.textContent = msg;
    successAlert.style.display = 'block';
  }

  function hideAlerts() {
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
