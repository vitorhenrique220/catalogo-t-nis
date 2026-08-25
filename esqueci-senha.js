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

       document.addEventListener('DOMContentLoaded', () => {
            const cartCountHeader = document.getElementById('cart-count');
            const recoveryForm = document.getElementById('recovery-form');
            const alertaBox = document.getElementById('mensagem-alerta');

          
            function atualizarContador() {
                const carrinho = JSON.parse(localStorage.getItem('carrinhoGamerVerse')) || [];
                const totalQtd = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
                if (cartCountHeader) cartCountHeader.textContent = totalQtd;
            }

           
            function exibirMensagem(texto, tipo = 'erro') {
                alertaBox.style.display = 'block';
                alertaBox.style.padding = '10px';
                alertaBox.style.marginBottom = '15px';
                alertaBox.style.borderRadius = '6px';
                alertaBox.style.textAlign = 'center';
                alertaBox.style.fontSize = '0.9rem';

                if (tipo === 'erro') {
                    alertaBox.style.backgroundColor = '#e74c3c';
                    alertaBox.style.color = '#fff';
                } else {
                    alertaBox.style.backgroundColor = '#2ecc71';
                    alertaBox.style.color = '#fff';
                }
                alertaBox.textContent = texto;
            }

         
            if (recoveryForm) {
                recoveryForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const email = document.getElementById('email').value.trim();

                    try {
                        const resposta = await fetch('/api/esqueceu-senha', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email })
                        });

                        const resultado = await resposta.json();

                        if (resposta.ok) {
                            exibirMensagem('Se este e-mail estiver cadastrado, enviamos as instruções de redefinição!', 'sucesso');
                            document.getElementById('email').value = '';
                        } else {
                            exibirMensagem(resultado.erro || 'Erro ao processar a solicitação.');
                        }
                    } catch (error) {
                      
                        exibirMensagem('Instruções enviadas! Verifique sua caixa de entrada.', 'sucesso');
                    }
                });
            }

            atualizarContador();
        });


if (recoveryForm) {
    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const btnSubmit = recoveryForm.querySelector('button[type="submit"]');


        btnSubmit.textContent = 'Enviando e-mail...';
        btnSubmit.disabled = true;

        try {
            const resposta = await fetch('/api/esqueceu-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                exibirMensagem(resultado.mensagem, 'sucesso');
                document.getElementById('email').value = '';
            } else {
                exibirMensagem(resultado.erro || 'Erro ao enviar o e-mail.');
            }
        } catch (error) {
            exibirMensagem('Não foi possível se conectar ao servidor.');
        } finally {
            btnSubmit.textContent = 'Enviar Instruções';
            btnSubmit.disabled = false;
        }
    });
}
