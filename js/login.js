document.addEventListener('DOMContentLoaded', () => {
    const entrarButton = document.querySelector('.btn-entrar');
    const errorMessage = document.getElementById('error-message');

    entrarButton.addEventListener('click', (event) => {
        event.preventDefault();

        const userType = document.getElementById('userType').value;
        const password = document.getElementById('password').value;

        if (!userType) {
            errorMessage.textContent = 'Preencha as informações corretamente.';
            errorMessage.classList.add('show');
        } else if (!password) {
            errorMessage.textContent = 'Preencha as informações corretamente.';
            errorMessage.classList.add('show');
        } else {
            // Salva o tipo de usuário no localStorage para usar na próxima página
            localStorage.setItem('userType', userType);
            window.location.href = 'calendario.html';
        }

        if (errorMessage.classList.contains('show')) {
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
});
