document.addEventListener('DOMContentLoaded', function () {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersSpan = document.getElementById('pageNumbers');
    const pageInput = document.getElementById('pageInput');
    const goToPageBtn = document.getElementById('goToPage');
    const tableBody = document.querySelector('#reservasTable tbody');

    let currentPage = 1;
    const recordsPerPage = 15;
    let totalPages = 1;
    let reservations = JSON.parse(localStorage.getItem('reservations')) || []; // Carrega reservas do localStorage

    function updatePaginationControls() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        pageNumbersSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        pageInput.value = currentPage;
    }

    function renderPage(pageReservations) {
        tableBody.innerHTML = '';

        pageReservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.cliente}</td>
                <td>${reservation.tema}</td>
                <td>${reservation.servico}</td>
                <td>${reservation.brinquedo}</td>
                <td>${reservation.formaPag}</td>
                <td>${reservation.day}</td>
                <td>${reservation.valor}</td>
                <td>${reservation.obs}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function applyPagination() {
        totalPages = Math.ceil(reservations.length / recordsPerPage);
        currentPage = Math.min(currentPage, totalPages);

        if (reservations.length > recordsPerPage) {
            prevPageBtn.style.display = 'inline-block';
            nextPageBtn.style.display = 'inline-block';
            pageInput.style.display = 'inline-block';
            goToPageBtn.style.display = 'inline-block';
            pageNumbersSpan.style.display = 'inline-block';
        } else {
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'none';
            pageInput.style.display = 'none';
            goToPageBtn.style.display = 'none';
            pageNumbersSpan.style.display = 'none';
        }

        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const pageReservations = reservations.slice(startIndex, endIndex);

        renderPage(pageReservations);
        updatePaginationControls();
    }

    prevPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            applyPagination();
        }
    });

    nextPageBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            applyPagination();
        }
    });

    goToPageBtn.addEventListener('click', function () {
        const pageNumber = parseInt(pageInput.value, 10);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            currentPage = pageNumber;
            applyPagination();
        }
    });

    // Inicializa a paginação
    applyPagination();
});
