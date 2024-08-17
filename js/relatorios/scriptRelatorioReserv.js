document.addEventListener('DOMContentLoaded', function () {
    const filterType = document.getElementById('filterType');
    const filterDate = document.getElementById('filterDate');
    const tableBody = document.querySelector('#reservasTable tbody');
    const valorTotalElement = document.getElementById('valorTotal');

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };

        // Formata a data e a hora separadamente
        const formattedDate = date.toLocaleDateString('pt-BR', optionsDate);
        const formattedTime = date.toLocaleTimeString('pt-BR', optionsTime);

        return `${formattedDate} ${formattedTime}`;
    }

    function adjustForTimezone(dateString) {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        return new Date(date.getTime() + userTimezoneOffset);
    }

    function updateReservationsTable(filter = 'all', date = null) {
        let totalValue = 0;

        const filteredReservations = reservations.filter(reservation => {
            const reservationDate = adjustForTimezone(reservation.day); // Adjusting for timezone

            switch (filter) {
                case 'day':
                    return reservationDate.toDateString() === adjustForTimezone(date).toDateString();
                case 'week':
                    const selectedDate = adjustForTimezone(date);
                    const startOfWeek = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay()));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6);
                    return reservationDate >= startOfWeek && reservationDate <= endOfWeek;
                case 'month':
                    const selectedMonth = adjustForTimezone(date);
                    return reservationDate.getFullYear() === selectedMonth.getFullYear() &&
                           reservationDate.getMonth() === selectedMonth.getMonth();
                default:
                    return true;
            }
        });

        tableBody.innerHTML = '';

        filteredReservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.cliente}</td>
                <td>${reservation.tema}</td>
                <td>${reservation.servico}</td>
                <td>${reservation.brinquedo}</td>
                <td>${reservation.formaPag}</td>
                <td>${formatDateTime(reservation.day)}</td>
                <td>${reservation.valor}</td>
                <td>${reservation.obs}</td>
            `;
            tableBody.appendChild(row);
            totalValue += parseFloat(reservation.valor) || 0;
        });

        valorTotalElement.textContent = totalValue.toFixed(2).replace('.', ',');
    }

    function applyFilter() {
        updateReservationsTable(filterType.value, filterDate.value);
    }

    filterType.addEventListener('change', function () {
        const selectedFilter = this.value;
        filterDate.style.display = (selectedFilter === 'day' || selectedFilter === 'week' || selectedFilter === 'month') ? 'inline' : 'none';
        applyFilter();
    });

    filterDate.addEventListener('change', function () {
        applyFilter();
    });

    // Inicializa a tabela sem filtros aplicados
    applyFilter();
});

function formatDateTime(dateTime) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTime).toLocaleDateString('pt-BR', options).replace(',', '');
}

function exportToExcel() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const ws = XLSX.utils.json_to_sheet(reservations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservas");
    XLSX.writeFile(wb, "reservas.xlsx");
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    let y = 10;

    // Adiciona cabeçalho
    doc.text("Relatório de Reservas", 10, y);
    y += 10;
    doc.text("Cliente | Tema | Serviço | Brinquedo | Forma de Pagamento | Data e Horário | Valor | Observações", 10, y);
    y += 10;

    // Adiciona cada reserva
    reservations.forEach((reservation) => {
        doc.text(`${reservation.cliente} | ${reservation.tema} | ${reservation.servico} | ${reservation.brinquedo} | ${reservation.formaPag} | ${formatDateTime(reservation.day)} | ${reservation.valor} | ${reservation.obs}`, 10, y);
        y += 10;
    });

    doc.save("reservas.pdf");
}
