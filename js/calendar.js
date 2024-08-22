document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const userType = localStorage.getItem('userType');
    const btnRelatorios = document.getElementById('btnRelatorios');

    if (btnRelatorios) { // Verifica se o botão existe no DOM
        if (userType === 'GERENCIAL') {
            btnRelatorios.style.display = 'block';
        } else if (userType === 'FUNCIONARIO') {
            btnRelatorios.style.display = 'none';
        }
    }

    if (calendarEl) {
        // Se o elemento do calendário estiver presente, inicialize o FullCalendar
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
                    title: `${reservation.cliente}`,
                    start: reservation.day,
                    extendedProps: {
                        tema: reservation.tema,
                        brinquedos: reservation.brinquedos,
                        formaPag: reservation.formaPag,
                        valor: reservation.valor,
                        obs: reservation.obs
                    }
                }));
                successCallback(events);
            },
            eventClick: function (info) {
                const modal = document.getElementById('eventModal');
                const modalCliente = document.getElementById('modalCliente');
                const modalTema = document.getElementById('modalTema');
                const modalBrinquedos = document.getElementById('modalBrinquedos');
                const modalFormaPag = document.getElementById('modalFormaPag');
                const modalValor = document.getElementById('modalValor');
                const modalObs = document.getElementById('modalObs');

                modalCliente.textContent = info.event.title;
                modalTema.textContent = info.event.extendedProps.tema;
                modalBrinquedos.textContent = info.event.extendedProps.brinquedos;
                modalFormaPag.textContent = info.event.extendedProps.formaPag;
                modalValor.textContent = info.event.extendedProps.valor;
                modalObs.textContent = info.event.extendedProps.obs || 'Nenhuma observação';

                modal.style.display = 'block';

                const closeModal = document.querySelector('.close');
                closeModal.onclick = function () {
                    modal.style.display = 'none';
                };

                if (!document.querySelector('.modal-content .delete-button')) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir Reserva';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = function () {
                        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                        reservations = reservations.filter(r => r.cliente !== info.event.title);
                        localStorage.setItem('reservations', JSON.stringify(reservations));
                        calendar.refetchEvents();
                        modal.style.display = 'none';
                    };
                    document.querySelector('.modal-content').appendChild(deleteButton);
                }
            },
            eventDrop: function (info) {
                let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
                let reservation = reservations.find(r => r.cliente === info.event.title);

                if (reservation) {
                    reservation.day = info.event.start.toISOString().split('T')[0];
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                }
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


