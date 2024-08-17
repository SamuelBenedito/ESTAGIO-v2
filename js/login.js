document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const btnRelatorios = document.getElementById('btnRelatorios');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita o comportamento padrão de envio do formulário

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

    // Mostra ou oculta o botão de relatórios baseado no tipo de usuário
    const userType = localStorage.getItem('userType');
    if (userType === 'GERENCIAL') {
        btnRelatorios.style.display = 'block';
    } else if (userType === 'FUNCIONARIO') {
        btnRelatorios.style.display = 'none';
    }
});
