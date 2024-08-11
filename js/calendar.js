document.addEventListener('DOMContentLoaded', function () {
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
        events: [
            {
                title: 'Registro teste 1',
                start: '2024-08-05'
            }
        ],
        eventClick: function (info) {
            alert('Evento: ' + info.event.title);
            info.el.style.borderColor = 'red';
        }
    });

    calendar.render();
});