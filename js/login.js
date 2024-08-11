document.addEventListener('DOMContentLoaded', () => {
    const entrarButton = document.querySelector('.btn-entrar');
    const errorMessage = document.getElementById('error-message');

    entrarButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        const userType = document.getElementById('userType').value;
        const password = document.getElementById('password').value;

        if (!userType) {
            errorMessage.textContent = 'Por favor, informe o usuário.';
            errorMessage.classList.add('show');
        } else if (!password) {
            errorMessage.textContent = 'Por favor, informe a senha.';
            errorMessage.classList.add('show');
        } else {
            window.location.href = 'calendario.html';
        }

        if (errorMessage.classList.contains('show')) {
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000); 
        }
    });
});
