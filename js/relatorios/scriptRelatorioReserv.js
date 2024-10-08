document.addEventListener('DOMContentLoaded', function () {
    const filterType = document.getElementById('filterType');
    const filterDate = document.getElementById('filterDate');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.querySelector('#reservasTable tbody');
    const valorTotalElement = document.getElementById('valorTotal');

    if (!filterType || !filterDate || !searchInput || !tableBody || !valorTotalElement) {
        console.error("Um ou mais elementos não foram encontrados.");
        return;
    }

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };

        const formattedDate = date.toLocaleDateString('pt-BR', optionsDate);
        const formattedTime = date.toLocaleTimeString('pt-BR', optionsTime);

        return `${formattedDate} ${formattedTime}`;
    }

    function adjustForTimezone(dateString) {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset);
    }

    function updateReservationsTable(filter = 'all', date = null, searchText = '') {
        let totalValue = 0;

        const filteredReservations = reservations.filter(reservation => {
            const reservationDate = adjustForTimezone(reservation.day);

            let matchesFilter = true;
            switch (filter) {
                case 'day':
                    matchesFilter = reservationDate.toDateString() === adjustForTimezone(date).toDateString();
                    break;
                case 'week':
                    const selectedDate = adjustForTimezone(date);
                    const startOfWeek = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay()));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6);
                    matchesFilter = reservationDate >= startOfWeek && reservationDate <= endOfWeek;
                    break;
                case 'month':
                    const selectedMonth = adjustForTimezone(date);
                    matchesFilter = reservationDate.getFullYear() === selectedMonth.getFullYear() &&
                                   reservationDate.getMonth() === selectedMonth.getMonth();
                    break;
            }

            // Filtro de pesquisa
            const searchLower = searchText.toLowerCase();
            const matchesSearch = reservation.cliente.toLowerCase().includes(searchLower) ||
                                  reservation.tema.toLowerCase().includes(searchLower) ||
                                  reservation.servico.toLowerCase().includes(searchLower) ||
                                  reservation.brinquedos.toLowerCase().includes(searchLower) ||
                                  reservation.formaPag.toLowerCase().includes(searchLower) ||
                                  reservation.obs.toLowerCase().includes(searchLower);

            return matchesFilter && matchesSearch;
        });

        tableBody.innerHTML = '';

        filteredReservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.cliente}</td>
                <td>${reservation.tema}</td>
                <td>${reservation.servico}</td>
                <td>${reservation.brinquedos}</td>
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
        updateReservationsTable(filterType.value, filterDate.value, searchInput.value);
    }

    function applySearch() {
        updateReservationsTable(filterType.value, filterDate.value, searchInput.value);
    }

    filterType.addEventListener('change', function () {
        const selectedFilter = this.value;
        filterDate.style.display = (selectedFilter === 'day' || selectedFilter === 'week' || selectedFilter === 'month') ? 'inline' : 'none';
        applyFilter();
    });

    filterDate.addEventListener('change', function () {
        applyFilter();
    });

    searchInput.addEventListener('input', function () {
        applySearch();
    });

    applyFilter(); // Inicializa a tabela sem filtros aplicados
});

function formatDateTime(dateTime) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTime).toLocaleDateString('pt-BR', options).replace(',', '');
}

async function exportToExcel() {
    const response = await fetch('get_reservas.php');
    const reservations = await response.json();
    const ws = XLSX.utils.json_to_sheet(reservations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservas");
    XLSX.writeFile(wb, "reservas.xlsx");
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');

    const response = await fetch('get_reservas.php');
    const reservations = await response.json();
    
    const margin = 10;
    const lineHeight = 10;
    const columnWidth = {
        cliente: 35,
        tema: 25,
        servico: 25,
        brinquedo: 25,
        formaPag: 30,
        dataHora: 60,
        valor: 30,
        obs: 50
    };
    const pageWidth = 297;
    const pageHeight = 210;
    let y = 20;

    function addHeader() {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Cliente", margin, y);
        doc.text("Tema", margin + columnWidth.cliente, y);
        doc.text("Serviço", margin + columnWidth.cliente + columnWidth.tema, y);
        doc.text("Brinquedo", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico, y);
        doc.text("Forma de Pagamento", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo, y);
        doc.text("Data e Horário", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + 20, y);
        doc.text("Valor", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + 20, y);
        doc.text("Observações", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + columnWidth.valor + 20, y);
        y += lineHeight;
        doc.line(margin, y, pageWidth - margin, y);
        y += lineHeight;
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Reservas", margin, y);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, y + 10);
    y += 20;

    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    addHeader();

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    reservations.forEach((reservation) => {
        doc.text(reservation.cliente, margin, y);
        doc.text(reservation.tema, margin + columnWidth.cliente, y);
        doc.text(reservation.servico, margin + columnWidth.cliente + columnWidth.tema, y);
        doc.text(reservation.brinquedo, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico, y);
        doc.text(reservation.formaPag, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo, y);
        doc.text(formatDateTime(reservation.data_reserva), margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + 20, y);
        doc.text(reservation.vlr_reserva.toString(), margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + 20, y);
        doc.text(reservation.obs, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + columnWidth.valor + 20, y);
        y += lineHeight;

        if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
            addHeader();
        }
    });

    doc.setFontSize(8);
    doc.text("Gerado por Salão System", margin, pageHeight - 10);

    doc.save("reserv.pdf");
}
