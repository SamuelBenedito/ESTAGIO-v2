document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if ((username === 'GERENCIAL' || username === 'FUNCIONARIO') && password === '123') {
            // Se as credenciais estiverem corretas, redirecionar para a página do calendário
            window.location.href = 'calendario.html';
        } else {
            // Se as credenciais estiverem incorretas, exibir uma mensagem de erro
            alert('Usuário ou senha incorretos.');
        }
    });
});
