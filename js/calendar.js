document.addEventListener('DOMContentLoaded', function () {
    const userType = localStorage.getItem('userType');
    const btnRelatorios = document.getElementById('btnRelatorios');

    if (userType === 'GERENCIAL') {
        btnRelatorios.style.display = 'block';
    } else if (userType === 'FUNCIONARIO') {
        btnRelatorios.style.display = 'none';
    }

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
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
        editable: true,
        dayMaxEvents: true,
        events: function(fetchInfo, successCallback, failureCallback) {
            const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const events = reservations.map(reservation => ({
                title: `${reservation.cliente} - ${reservation.servico}`,
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
            alert('Evento: ' + info.event.title);
            info.el.style.borderColor = 'red';
        }
    });

    calendar.render();
});
