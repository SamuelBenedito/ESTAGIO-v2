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
            timeZone: 'America/Sao_Paulo',
            navLinks: true,
            editable: false,
            dayMaxEvents: true,
            events: function (fetchInfo, successCallback, failureCallback) {
                // Faz a requisição para o PHP
                fetch('calendar.php')  // Altere para o caminho correto do seu arquivo PHP
                    .then(response => response.json())
                    .then(data => {
                        console.log("Eventos recebidos do servidor:", data);  // Exibe os dados no console
                        successCallback(data);  // Passa os dados para o calendário
                    })
                    .catch(error => {
                        console.error('Erro ao buscar os eventos: ', error);  // Exibe erros no console
                        failureCallback(error);
                    });
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
                modalBrinquedos.value = info.event.extendedProps.brinquedos || ''; 
                modalFormaPag.value = info.event.extendedProps.formaPag;
                // Cria uma nova data a partir de info.event.start e adiciona 3 horas
                const eventStart = new Date(info.event.start);
                eventStart.setHours(eventStart.getHours() + 3); // Adiciona 3 horas

                // Formata a data no formato desejado (YYYY-MM-DDTHH:MM)
                modalDay.value = eventStart.toISOString().split('T')[0] + 'T' + eventStart.toTimeString().split(' ')[0];

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
            
                    const updatedData = {
                        cliente: modalCliente.value,
                        tema: modalTema.value,
                        servico: modalServico.value,
                        brinquedos: modalBrinquedos.value,
                        formaPag: modalFormaPag.value,
                        day: modalDay.value,
                        valor: modalValor.value,
                        obs: modalObs.value,
                        originalCliente: info.event.title  // Adiciona o cliente original para identificar qual reserva atualizar
                    };
            
                    fetch('updateReservation.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            calendar.refetchEvents();
                            modal.style.display = 'none';
                        } else {
                            console.error('Erro ao atualizar a reserva: ', result.error);
                        }
                    })
                    .catch(error => console.error('Erro ao atualizar: ', error));
                };
            
                // Função para deletar a reserva
                const deleteButton = document.querySelector('.delete-button');
                deleteButton.onclick = function () {
                    const deleteData = {
                        cliente: info.event.title  // Identifica o cliente da reserva a ser excluída
                    };
            
                    fetch('deleteReservation.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(deleteData)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            calendar.refetchEvents();
                            modal.style.display = 'none';
                        } else {
                            console.error('Erro ao deletar a reserva: ', result.error);
                        }
                    })
                    .catch(error => console.error('Erro ao deletar: ', error));
                };
            }
        });            

        calendar.render();
    }

    function formatCurrency(value) {
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return "R$ " + value;
    }

    const modalValor = document.getElementById('modalValor');
    modalValor.addEventListener('input', function () {
        modalValor.value = formatCurrency(modalValor.value);
    });
});
