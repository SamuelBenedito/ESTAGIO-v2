document.addEventListener('DOMContentLoaded', async function () {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersSpan = document.getElementById('pageNumbers');
    const pageInput = document.getElementById('pageInput');
    const goToPageBtn = document.getElementById('goToPage');
    const tableBody = document.querySelector('#reservasTable tbody');

    let currentPage = 1;
    const recordsPerPage = 15;
    let totalPages = 1;
    let reservations = [];

    // Função para carregar as reservas do banco de dados
    async function loadReservations() {
        try {
            const response = await fetch('get_reservas.php');
            if (!response.ok) throw new Error('Erro ao carregar reservas');
            reservations = await response.json();
            applyPagination(); // Chama a função de paginação após carregar as reservas
        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar as reservas.'); // Exibe erro ao usuário
        }
    }

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
            // Converte vlr_reserva para número, caso não seja
            const valor = Number(reservation.vlr_reserva); // Converte para número
            row.innerHTML = `
                <td>${reservation.cliente}</td>
                <td>${reservation.tema}</td>
                <td>${reservation.servico}</td>
                <td>${reservation.brinquedo}</td>
                <td>${reservation.formaPag}</td>
                <td>${new Date(reservation.data_reserva).toLocaleString('pt-BR')}</td>
                <td>${!isNaN(valor) ? valor.toFixed(2).replace('.', ',') : '0,00'}</td> <!-- Verifica se é um número -->
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

    // Carrega as reservas ao iniciar a página
    loadReservations();
});