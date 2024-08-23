document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const userType = localStorage.getItem('userType');
    const btnRelatorios = document.getElementById('btnRelatorios');

    if (btnRelatorios) {
        btnRelatorios.style.display = (userType === 'GERENCIAL') ? 'block' : 'none';
    }

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt-br',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prevYear,prev,next,nextYear today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
            },
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
            },
            timeZone: 'local',
            navLinks: true,
            editable: false,
            dayMaxEvents: true,
            events: function (fetchInfo, successCallback, failureCallback) {
                const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                const events = reservations.map(reservation => ({
                    title: reservation.cliente,
                    start: reservation.day,
                    extendedProps: {
                        tema: reservation.tema,
                        servico: reservation.servico,
                        brinquedos: reservation.brinquedos || '', // Define um valor padrão se estiver faltando
                        formaPag: reservation.formaPag,
                        valor: reservation.valor,
                        obs: reservation.obs || ''
                    }
                }));
                successCallback(events);
            },
            eventClick: function (info) {
                const modal = document.getElementById('eventModal');
                const modalCliente = document.getElementById('modalCliente');
                const modalTema = document.getElementById('modalTema');
                const modalServico = document.getElementById('modalServico');
                const modalBrinquedos = document.getElementById('modalBrinquedos');
                const modalFormaPag = document.getElementById('modalFormaPag');
                const modalDay = document.getElementById('modalDay');
                const modalValor = document.getElementById('modalValor');
                const modalObs = document.getElementById('modalObs');

                // Preenche o formulário com as informações do evento
                modalCliente.value = info.event.title;
                modalTema.value = info.event.extendedProps.tema;
                modalServico.value = info.event.extendedProps.servico;
                modalBrinquedos.value = info.event.extendedProps.brinquedos || ''; // Define um valor padrão se estiver faltando
                modalFormaPag.value = info.event.extendedProps.formaPag;
                modalDay.value = info.event.start.toISOString().split('T')[0] + 'T' + info.event.start.toTimeString().split(' ')[0];
                modalValor.value = info.event.extendedProps.valor;
                modalObs.value = info.event.extendedProps.obs || '';

                modal.style.display = 'block';

                const closeModal = document.querySelector('.close');
                closeModal.onclick = function () {
                    modal.style.display = 'none';
                };

                // Manipula o envio do formulário de edição
                const editButton = document.querySelector('.modal-actions button[type="submit"]');
                editButton.onclick = function (e) {
                    e.preventDefault();

                    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                    let reservation = reservations.find(r => r.cliente === info.event.title);

                    if (reservation) {
                        reservation.cliente = modalCliente.value;
                        reservation.tema = modalTema.value;
                        reservation.servico = modalServico.value;
                        reservation.brinquedos = modalBrinquedos.value;
                        reservation.formaPag = modalFormaPag.value;
                        reservation.day = modalDay.value;
                        reservation.valor = modalValor.value;
                        reservation.obs = modalObs.value;

                        localStorage.setItem('reservations', JSON.stringify(reservations));
                        calendar.refetchEvents();
                        modal.style.display = 'none';
                    }
                };

                const deleteButton = document.querySelector('.delete-button');
                deleteButton.onclick = function () {
                    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                    reservations = reservations.filter(r => r.cliente !== info.event.title);
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    calendar.refetchEvents();
                    modal.style.display = 'none';
                };
            }
        });

        calendar.render();

        window.onclick = function (event) {
            const modal = document.getElementById('eventModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
});
