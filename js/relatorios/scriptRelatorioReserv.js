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
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para paisagem, 'mm' para milímetros, 'a4' para tamanho A4

    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const margin = 10;
    const lineHeight = 10;
    const columnWidth = {
        cliente: 35,
        tema: 25,
        servico: 25,
        brinquedo: 25,
        formaPag: 30,
        dataHora: 60, // Aumentado para mais espaço
        valor: 30,    // Aumentado para mais espaço
        obs: 50
    };
    const pageWidth = 297; // Largura da página A4 em mm para orientação paisagem
    const pageHeight = 210; // Altura da página A4 em mm para orientação paisagem
    let y = 20; // Posição Y inicial para o conteúdo

    // Função auxiliar para adicionar o cabeçalho
    function addHeader() {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Cliente", margin, y);
        doc.text("Tema", margin + columnWidth.cliente, y);
        doc.text("Serviço", margin + columnWidth.cliente + columnWidth.tema, y);
        doc.text("Brinquedo", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico, y);
        doc.text("Forma de Pagamento", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo, y);
        doc.text("Data e Horário", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + 20, y); // Espaço adicional
        doc.text("Valor", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + 20, y); // Espaço adicional
        doc.text("Observações", margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + columnWidth.valor + 20, y); // Espaço adicional
        y += lineHeight;
        doc.line(margin, y, pageWidth - margin, y);
        y += lineHeight;
    }

    // Adiciona o título do relatório
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Reservas", margin, y);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, y + 10);
    y += 20;

    // Adiciona linha de separação
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Adiciona o cabeçalho da tabela
    addHeader();

    // Adiciona cada reserva
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    reservations.forEach((reservation) => {
        doc.text(reservation.cliente, margin, y);
        doc.text(reservation.tema, margin + columnWidth.cliente, y);
        doc.text(reservation.servico, margin + columnWidth.cliente + columnWidth.tema, y);
        doc.text(reservation.brinquedo, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico, y);
        doc.text(reservation.formaPag, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo, y);
        doc.text(formatDateTime(reservation.day), margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + 20, y); // Espaço adicional
        doc.text(reservation.valor.toString(), margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + 20, y); // Espaço adicional
        doc.text(reservation.obs, margin + columnWidth.cliente + columnWidth.tema + columnWidth.servico + columnWidth.brinquedo + columnWidth.formaPag + columnWidth.dataHora + columnWidth.valor + 20, y); // Espaço adicional
        y += lineHeight;

        // Adiciona nova página se necessário
        if (y > pageHeight - 30) { // Deixa espaço para o rodapé
            doc.addPage();
            y = 20;
            addHeader();
        }
    });

    // Adiciona rodapé
    doc.setFontSize(8);
    doc.text("Gerado por Salão System", margin, pageHeight - 10);

    doc.save("reservas.pdf");
}

// Função auxiliar para formatar data e hora
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
