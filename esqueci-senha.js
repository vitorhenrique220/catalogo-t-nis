document.addEventListener('DOMContentLoaded', () => {
  const forgotForm = document.getElementById('forgotForm');
  const emailInput = document.getElementById('email');
  const errorAlert = document.getElementById('errorAlert');
  const successAlert = document.getElementById('successAlert');

  if (!forgotForm) {
    console.error('Formulário não encontrado!');
    return;
  }

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlerts();

    const email = emailInput.value.trim();

  
    if (!email) {
      showError('Por favor, digite seu e-mail.');
      return;
    }

  
    if (!isValidEmail(email)) {
      showError('Por favor, digite um e-mail válido (ex: nome@dominio.com).');
      return;
    }

  
    showSuccess('Instruções enviadas! Redirecionando para o login...');
    emailInput.value = '';

 
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
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
