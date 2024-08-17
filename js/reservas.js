document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('clientForm');
    const addClienteBtn = document.getElementById('addCliente');
    const addTemaBtn = document.getElementById('addTema');
    const addServicoBtn = document.getElementById('addServico');
    const addBrinquedoBtn = document.getElementById('addBrinquedo');
    const addFormaPagBtn = document.getElementById('addFormaPag');

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

    // Manipula o envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Coleta os dados do formulário
        const cliente = document.getElementById('cliente').value;
        const tema = document.getElementById('tema').value;
        const servico = document.getElementById('servico').value;
        const brinquedo = document.getElementById('brinquedo').value;
        const formaPag = document.getElementById('formaPag').value;
        const day = document.getElementById('day').value;
        const valor = document.getElementById('valor').value;
        const obs = document.getElementById('obs').value;

        // Cria um objeto de reserva
        const newReservation = {
            cliente,
            tema,
            servico,
            brinquedo,
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

        // Atualiza o calendário
        const calendarEl = document.getElementById('calendar');
        const calendar = FullCalendar.getCalendar(calendarEl);
        calendar.refetchEvents();
    });
});
