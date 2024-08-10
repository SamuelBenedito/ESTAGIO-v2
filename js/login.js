document.addEventListener('DOMContentLoaded', () => {
    // Obtém os elementos do formulário e do botão
    const loginForm = document.getElementById('loginForm');
    const entrarButton = document.querySelector('.btn-entrar');
    const errorMessage = document.getElementById('error-message');
    
    // Adiciona um ouvinte de eventos para o clique no botão "Entrar"
    entrarButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link

        // Obtém os valores dos campos do formulário
        const userType = document.getElementById('userType').value;
        const password = document.getElementById('password').value;

        // Verifica se o campo "Tipo de Usuário" foi preenchido e se a senha foi informada
        if (userType && password) {
            // Se o formulário for válido, redireciona para a página de calendário
            window.location.href = 'calendario.html';
        } else {
            // Se algum campo não for preenchido, mostra uma mensagem de erro
            errorMessage.textContent = 'Por favor, preencha todos os campos corretamente.';
            errorMessage.classList.add('show');

            // Oculta a mensagem após alguns segundos
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000); // 3 segundos
        }
    });
});
