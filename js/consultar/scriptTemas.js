document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('temasForm');
    const tableBody = document.querySelector('.temas-table tbody');
    const searchInput = document.getElementById('searchTema');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editInput = document.getElementById('editTema');
    const closeEditModal = document.getElementById('closeEditModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumberSpan = document.getElementById('pageNumber');
    let rowToDelete;
    let rowToEdit;
    let currentPage = 1;
    const rowsPerPage = 10;
    let temas = [];

    function renderTable() {
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const filteredTemas = temas.filter(t => t.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        const paginatedTemas = filteredTemas.slice(start, end);

        if (filteredTemas.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        paginatedTemas.forEach((data, index) => {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = start + index + 1;
            nomeCell.textContent = data.name;

            const editButton = document.createElement('button');
            editButton.textContent = 'Alterar';
            editButton.classList.add('btn', 'btn-edit');
            editButton.addEventListener('click', function() {
                openEditModal(newRow);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('btn', 'btn-delete');
            deleteButton.addEventListener('click', function() {
                rowToDelete = newRow;
                confirmationModal.style.display = 'flex';
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            newRow.appendChild(idCell);
            newRow.appendChild(nomeCell);
            newRow.appendChild(actionsCell);

            tableBody.appendChild(newRow);
        });

        updatePaginationControls();
    }

    function updatePaginationControls() {
        const filteredTemas = temas.filter(t => t.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * rowsPerPage >= filteredTemas.length;
        pageNumberSpan.textContent = `Página ${currentPage}`;
    }

    function saveTableToLocalStorage() {
        localStorage.setItem('temas', JSON.stringify(temas));
    }

    function loadTableFromLocalStorage() {
        const storedData = localStorage.getItem('temas');
        if (storedData) {
            temas = JSON.parse(storedData);
            renderTable();
        }
    }

    loadTableFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const temaInput = document.getElementById('temas');
        const temaValue = temaInput.value.trim();

        if (temaValue) {
            temas.push({ id: temas.length + 1, name: temaValue });
            saveTableToLocalStorage();
            renderTable();
            temaInput.value = '';
        } else {
            alert('Por favor, insira o nome do tema.');
        }
    });

    function openEditModal(row) {
        rowToEdit = row;
        editInput.value = row.children[1].textContent;
        editModal.style.display = 'flex';
    }

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedValue = editInput.value.trim();

        if (updatedValue) {
            const index = Array.from(tableBody.children).indexOf(rowToEdit);
            temas[(currentPage - 1) * rowsPerPage + index].name = updatedValue;
            renderTable();
            editModal.style.display = 'none';
            saveTableToLocalStorage();
        } else {
            alert('Por favor, insira o nome do tema.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            const index = Array.from(tableBody.children).indexOf(rowToDelete);
            temas.splice((currentPage - 1) * rowsPerPage + index, 1);
            renderTable();
            saveTableToLocalStorage();
            confirmationModal.style.display = 'none';
        }
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    searchInput.addEventListener('input', function() {
        currentPage = 1; // Reset to the first page on search
        renderTable();
    });

    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener('click', function() {
        const filteredTemas = temas.filter(t => t.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        if (currentPage * rowsPerPage < filteredTemas.length) {
            currentPage++;
            renderTable();
        }
    });
});
