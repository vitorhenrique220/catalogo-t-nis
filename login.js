document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
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

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const remember = document.getElementById('remember').checked;

    hideError();

    if (!email || !password) {
      showError('Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    console.log('Login solicitado:', { email, remember });


    window.location.href = 'inicio.html';
  });

  function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
  }

  function hideError() {
    errorAlert.style.display = 'none';
    errorAlert.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});