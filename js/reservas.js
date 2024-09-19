document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('clientForm');
    const addClienteBtn = document.getElementById('addCliente');
    const addTemaBtn = document.getElementById('addTema');
    const addServicoBtn = document.getElementById('addServico');
    const addBrinquedoBtn = document.getElementById('addBrinquedo');
    const addFormaPagBtn = document.getElementById('addFormaPag');
    const valorInput = document.getElementById('valor');

    // Adiciona funcionalidades aos botões de adicionar
    addClienteBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para sugestões de clientes
    });

    addTemaBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para sugestões de temas
    });

    addServicoBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para sugestões de serviços
    });

    addBrinquedoBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para sugestões de brinquedos
    });

    addFormaPagBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para sugestões de formas de pagamento
    });

    // Função para aplicar máscara de moeda (R$)
    function formatCurrency(value) {
        value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
        value = (value / 100).toFixed(2) + ""; // Converte para formato decimal
        value = value.replace(".", ","); // Substitui o ponto por vírgula
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Coloca ponto como separador de milhar
        return "R$ " + value;
    }

    // Aplica a máscara no campo de valor
    valorInput.addEventListener('input', function () {
        valorInput.value = formatCurrency(valorInput.value);
    });

    // Função para desformatar o valor da moeda
    function parseCurrency(value) {
        return parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }

    // Manipula o envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Coleta os dados do formulário
        const cliente = document.getElementById('cliente').value;
        const tema = document.getElementById('tema').value;
        const servico = document.getElementById('servico').value;
        const brinquedos = document.getElementById('brinquedo').value; // Ajustado para plural
        const formaPag = document.getElementById('formaPag').value;
        const day = document.getElementById('day').value;
        const valor = parseCurrency(valorInput.value); // Converte para valor numérico
        const obs = document.getElementById('obs').value;

        // Cria um objeto de reserva
        const newReservation = {
            cliente,
            tema,
            servico,
            brinquedos, // Ajustado para plural
            formaPag,
            day,
            valor,
            obs
        };

        // Adiciona a reserva ao localStorage
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(newReservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));

        // Limpa o formulário
        form.reset();

        // Atualiza o calendário apenas se o elemento estiver presente
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            const calendar = FullCalendar.getCalendar(calendarEl);
            if (calendar) {
                calendar.refetchEvents(); // Atualiza os eventos do calendário
            } else {
                console.error('Instância do calendário não encontrada.');
            }
        } else {
            console.warn('Elemento de calendário não encontrado. O calendário não será atualizado.');
        }

        // Redireciona para a página calendario.html
        window.location.href = 'calendario.html';
    });
});
