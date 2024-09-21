document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o comportamento padrão de envio do formulário

        const username = document.getElementById('username').value.trim(); // Obtendo o nome
        const password = document.getElementById('password').value.trim();

        // Verifica se os campos foram preenchidos
        if (!username || !password) {
            errorMessage.textContent = 'Preencha todos os campos.';
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
            return;
        }

        try {
            // Envia a requisição para o backend
            const response = await fetch('http://localhost/ESTAGIO-v2/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: username,  // Enviando o nome
                    password: password
                })
            });

            const result = await response.json();

            if (result.success) {
    
                window.location.href = 'calendario.html';
            } else {
                // Exibe mensagem de erro
                errorMessage.textContent = result.message || 'Erro ao realizar login.';
                errorMessage.classList.add('show');
                setTimeout(() => {
                    errorMessage.classList.remove('show');
                }, 5000);
            }
        } catch (error) {
            console.error('Erro:', error);
            errorMessage.textContent = 'Erro no servidor. Tente novamente mais tarde.';
            errorMessage.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        }
    });
});
