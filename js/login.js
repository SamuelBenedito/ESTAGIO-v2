document.addEventListener('DOMContentLoaded', () => {
    const entrarButton = document.querySelector('.btn-entrar');
    const errorMessage = document.getElementById('error-message');

    entrarButton.addEventListener('click', (event) => {
        event.preventDefault();

        const userType = document.getElementById('userType').value.trim();
        const password = document.getElementById('password').value.trim();

        // Verifica se a combinação de usuário e senha é válida
        if ((userType === 'GERENCIAL' && password === 'gerencial') ||
            (userType === 'FUNCIONARIO' && password === 'funcionario')) {
            // Salva o tipo de usuário no localStorage para usar na próxima página
            localStorage.setItem('userType', userType);
            window.location.href = 'calendario.html';
        } else {
            // Exibe mensagem de erro se as credenciais forem inválidas
            errorMessage.textContent = 'Usuário ou senha incorretos.';
            errorMessage.classList.add('show');

            // Oculta a mensagem de erro após 3 segundos
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
});
