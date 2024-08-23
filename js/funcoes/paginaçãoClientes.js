document.addEventListener('DOMContentLoaded', function () {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersSpan = document.getElementById('pageNumbers');
    const pageInput = document.getElementById('pageInput');
    const goToPageBtn = document.getElementById('goToPage');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.querySelector('#clientesTable tbody');

    let currentPage = 1;
    const recordsPerPage = 15;
    let totalPages = 1;
    let clients = JSON.parse(localStorage.getItem('clients')) || []; // Carrega clientes do localStorage
    let filteredClients = clients; // Inicialmente, todos os clientes são exibidos

    function updatePaginationControls() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        pageNumbersSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        pageInput.value = currentPage;
    }

    function renderPage(pageClients) {
        tableBody.innerHTML = '';

        pageClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.cliente}</td>
                <td>${client.telefone}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function applyPagination() {
        totalPages = Math.ceil(filteredClients.length / recordsPerPage);
        currentPage = Math.min(currentPage, totalPages);

        if (filteredClients.length > recordsPerPage) {
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
        const pageClients = filteredClients.slice(startIndex, endIndex);

        renderPage(pageClients);
        updatePaginationControls();
    }

    function filterClients() {
        const searchTerm = searchInput.value.toLowerCase();

        filteredClients = clients.filter(client => {
            return client.cliente.toLowerCase().includes(searchTerm) ||
                   client.telefone.toLowerCase().includes(searchTerm) ||
                   client.email.toLowerCase().includes(searchTerm) ||
                   client.cpf.toLowerCase().includes(searchTerm);
        });

        currentPage = 1; // Reseta a página atual para 1 após a filtragem
        applyPagination();
    }

    searchInput.addEventListener('input', filterClients);

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
