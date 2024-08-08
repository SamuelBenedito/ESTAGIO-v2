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
            },
            {
                title: 'Registro teste 2',
                start: '2024-08-06'
            },
            {
                title: 'Registro teste 3',
                start: '2024-08-07'
            },
            {
                title: 'Registro teste 4',
                start: '2024-08-08'
            }

        ],
        eventClick: function (info) {
            alert('Evento: ' + info.event.title);
            info.el.style.borderColor = 'red';
        }
    });

    calendar.render();
});