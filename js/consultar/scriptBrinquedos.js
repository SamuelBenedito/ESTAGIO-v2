document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('brinquedoForm');
    const tableBody = document.querySelector('.brinquedos-table tbody');
    const searchInput = document.getElementById('searchBrinquedo');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editInput = document.getElementById('editBrinquedo');
    const closeEditModal = document.getElementById('closeEditModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumberSpan = document.getElementById('pageNumber');

    let currentPage = 1;
    const rowsPerPage = 10;
    let brinquedos = [];
    let rowToEdit = null;
    let rowToDelete = null;

    function loadData() {
        fetch('brinquedos.php')
            .then(response => response.json())
            .then(data => {
                brinquedos = data;
                renderTable();
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    function renderTable() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const filteredBrinquedos = brinquedos.filter(b => b.nome.toLowerCase().includes(searchInput.value.toLowerCase()));
        const paginatedBrinquedos = filteredBrinquedos.slice(startIndex, endIndex);

        noResultsMessage.style.display = filteredBrinquedos.length === 0 ? 'block' : 'none';

        paginatedBrinquedos.forEach(data => {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = data.idBrinquedos;
            nomeCell.textContent = data.nome;

            const editButton = document.createElement('button');
            editButton.textContent = 'Alterar';
            editButton.classList.add('btn', 'btn-edit');
            editButton.addEventListener('click', function() {
                openEditModal(data.idBrinquedos, data.nome);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('btn', 'btn-delete');
            deleteButton.addEventListener('click', function() {
                rowToDelete = data.idBrinquedos;
                confirmationModal.style.display = 'flex';
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            newRow.appendChild(idCell);
            newRow.appendChild(nomeCell);
            newRow.appendChild(actionsCell);

            tableBody.appendChild(newRow);
        });

        updatePaginationControls(filteredBrinquedos.length);
    }

    function updatePaginationControls(totalItems) {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * rowsPerPage >= totalItems;
        pageNumberSpan.textContent = `Página ${currentPage}`;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const brinquedoInput = document.getElementById('brinquedos');
        const brinquedoValue = brinquedoInput.value.trim();

        if (brinquedoValue) {
            // Verifica se o nome já existe
            if (brinquedos.some(b => b.nome.toLowerCase() === brinquedoValue.toLowerCase())) {
                alert('Brinquedo com este nome já cadastrado!');
                return;
            }

            fetch('brinquedos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ brinquedos: brinquedoValue })
            })
            .then(response => response.json())
            .then(() => {
                loadData();
                brinquedoInput.value = '';
            })
            .catch(error => console.error('Erro ao adicionar:', error));
        }
    });

    function openEditModal(id, nome) {
        rowToEdit = id;
        editInput.value = nome;
        editModal.style.display = 'flex';
    }

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedValue = editInput.value.trim();

        if (updatedValue) {
            // Verifica se o nome já existe (exceto o atual)
            if (brinquedos.some(b => b.nome.toLowerCase() === updatedValue.toLowerCase() && b.idBrinquedos !== rowToEdit)) {
                alert('Brinquedo com este nome já cadastrado!');
                return;
            }

            fetch(`brinquedos.php?id=${rowToEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ brinquedos: updatedValue })
            })
            .then(response => response.json())
            .then(() => {
                editModal.style.display = 'none';
                loadData();
            })
            .catch(error => console.error('Erro ao atualizar:', error));
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            fetch('brinquedos.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: rowToDelete })
            })
            .then(response => response.json())
            .then(() => {
                confirmationModal.style.display = 'none';
                loadData();
            })
            .catch(error => console.error('Erro ao excluir:', error));
        }
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    searchInput.addEventListener('input', function() {
        currentPage = 1;
        renderTable();
    });

    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener('click', function() {
        const filteredBrinquedos = brinquedos.filter(b => b.nome.toLowerCase().includes(searchInput.value.toLowerCase()));
        if (currentPage * rowsPerPage < filteredBrinquedos.length) {
            currentPage++;
            renderTable();
        }
    });

    loadData();
});