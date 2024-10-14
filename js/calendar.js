document.addEventListener("DOMContentLoaded", function () {
    console.log('teste novo 2')
  const calendarEl = document.getElementById("calendar");
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const btnRelatorios = document.getElementById("btnRelatorios");

  // Mostra ou oculta o botão de relatórios com base no tipo de usuário
  if (btnRelatorios) {
    btnRelatorios.style.display =
      tipoUsuario === "GERENCIAL" ? "block" : "none";
  }

  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "pt-br",
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prevYear,prev,next,nextYear today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      },
      buttonText: {
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia",
      },
      timeZone: "America/Sao_Paulo",
      navLinks: true,
      editable: false,
      dayMaxEvents: true,
      events: function (fetchInfo, successCallback, failureCallback) {
        // Faz a requisição para o PHP
        fetch("calendar.php") // Altere para o caminho correto do seu arquivo PHP
          .then((response) => response.json())
          .then((data) => {
            console.log("Eventos recebidos do servidor:", data); // Exibe os dados no console
            successCallback(data); // Passa os dados para o calendário
          })
          .catch((error) => {
            console.error("Erro ao buscar os eventos: ", error); // Exibe erros no console
            failureCallback(error);
          });
      },

      eventClick: function (info) {
        const modal = document.getElementById("eventModal");
        const modalCliente = document.getElementById("modalCliente");
        const modalTema = document.getElementById("modalTema");
        const modalServico = document.getElementById("modalServico");
        const modalBrinquedos = document.getElementById("modalBrinquedos");
        const modalFormaPag = document.getElementById("modalFormaPag");
        const modalDay = document.getElementById("modalDay");
        const modalValor = document.getElementById("modalValor");
        const modalObs = document.getElementById("modalObs");

        // Preenche o formulário com as informações do evento
        modalCliente.value = info.event.title;
        modalTema.value = info.event.extendedProps.tema;
        modalServico.value = info.event.extendedProps.servico;
        modalBrinquedos.value = info.event.extendedProps.brinquedo || ""; // Ajuste para "brinquedo"
        modalFormaPag.value = info.event.extendedProps.formaPag;

        // Cria uma nova data a partir de info.event.start e adiciona 3 horas
        const eventStart = new Date(info.event.start);
        eventStart.setHours(eventStart.getHours() + 3); // Adiciona 3 horas para ajustar o fuso horário

        // Formata a data no formato desejado (YYYY-MM-DDTHH:MM)
        modalDay.value =
          eventStart.toISOString().split("T")[0] +
          "T" +
          eventStart.toTimeString().split(" ")[0];

        // Formata o valor para exibição
        const valorFormatado = formatCurrency(
          info.event.extendedProps.valor.toString()
        );
        modalValor.value = valorFormatado;

        modalObs.value = info.event.extendedProps.obs || "";

        modal.style.display = "block";

        const closeModal = document.querySelector(".close");
        closeModal.onclick = function () {
          modal.style.display = "none";
        };

        // Manipula o envio do formulário de edição
        const editButton = document.querySelector(
          '.modal-actions button[type="submit"]'
        );
        editButton.onclick = function (e) {
          e.preventDefault();
          
          // Trim whitespace from values
          const clienteValue = modalCliente.value.trim();
          const temaValue = modalTema.value.trim();
          const servicoValue = modalServico.value.trim();
          const brinquedoValue = modalBrinquedos.value.trim();
          const formaPagValue = modalFormaPag.value.trim();
          const dayValue = modalDay.value.trim();
          const valorValue = modalValor.value.trim();
          
          // Validate required fields
          if (!clienteValue || !temaValue || !servicoValue || !brinquedoValue || !formaPagValue || !dayValue || !valorValue) {
              alert("Por favor, preencha todos os campos obrigatórios.");
              return; // Stop the function if validation fails
          }
          
          const updatedData = {
              idReserva: info.event.id,
              cliente: clienteValue,
              tema: temaValue,
              servico: servicoValue,
              brinquedos: brinquedoValue,
              formaPag: formaPagValue,
              day: dayValue,
              valor: valorValue.replace("R$ ", "").replace(".", "").replace(",", "."),
              obs: modalObs.value.trim()
          };
      
          fetch("updateReservation.php", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedData),
          })
          .then((response) => response.json())
          .then((result) => {
              if (result.success) {
                  calendar.refetchEvents();
                  modal.style.display = "none";
              } else {
                  alert(result.message || "Erro ao atualizar a reserva.");
              }
          })
          .catch((error) => console.error("Erro ao atualizar: ", error));
      };
        
        

        // Função para deletar a reserva
        // Função para deletar a reserva
        const deleteButton = document.querySelector(".delete-button");
        deleteButton.onclick = function () {
            const deleteData = {
                idReserva: info.event.id, // Captura o idReserva diretamente do evento
                cliente: info.event.title // Identifica o cliente da reserva a ser excluída (opcional)
            };
        
            fetch('deleteReservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteData) // Envia o idReserva no body da requisição
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json(); // Garante que está lidando com JSON
            })
            .then(result => {
                if (result.success) {
                    calendar.refetchEvents(); // Atualiza o calendário
                    modal.style.display = 'none'; // Fecha o modal
                } else {
                    console.error('Erro ao deletar a reserva: ', result.error);
                }
            })
            .catch(error => console.error('Erro ao deletar: ', error));
        };
        
        
      },
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

  const modalValor = document.getElementById("modalValor");
  modalValor.addEventListener("input", function () {
    modalValor.value = formatCurrency(modalValor.value);
  });
});