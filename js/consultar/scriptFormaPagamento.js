document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formasPagamentoForm');
    const tableBody = document.querySelector('.formasPagamento-table tbody');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editInput = document.getElementById('editFormaDePagamento');
    const closeEditModal = document.getElementById('closeEditModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const searchInput = document.getElementById('searchFormPag');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumberSpan = document.getElementById('pageNumber');

    let currentPage = 1;
    const rowsPerPage = 10;
    let allData = [];
    let filteredData = [];

    // Função para salvar a tabela no localStorage
    function saveTableToLocalStorage() {
        localStorage.setItem('formasPagamento', JSON.stringify(allData));
    }

    // Função para carregar a tabela do localStorage
    function loadTableFromLocalStorage() {
        const storedData = localStorage.getItem('formasPagamento');
        if (storedData) {
            allData = JSON.parse(storedData);
            filteredData = [...allData];
            renderTable();
        }
    }

    // Função para renderizar a tabela com dados filtrados e paginados
    function renderTable() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        if (filteredData.length === 0) {
            noResultsMessage.style.display = 'block'; // Mostrar mensagem de nenhum resultado
        } else {
            noResultsMessage.style.display = 'none'; // Ocultar mensagem de nenhum resultado
        }

        paginatedData.forEach(data => {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = data.id;
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

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = endIndex >= filteredData.length;
        pageNumberSpan.textContent = `Página ${currentPage}`;
    }

    function openEditModal(row) {
        rowToEdit = row;
        editInput.value = row.children[1].textContent;
        editModal.style.display = 'flex';
    }

    // Função para filtrar dados
    function filterTable() {
        const searchValue = searchInput.value.toLowerCase();
        filteredData = allData.filter(data =>
            data.name.toLowerCase().includes(searchValue)
        );
        currentPage = 1; // Reset to first page after search
        renderTable();
    }

    searchInput.addEventListener('input', filterTable);

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const formaPagamentoInput = document.getElementById('formasPagamento');
        const formaPagamentoValue = formaPagamentoInput.value.trim();

        if (formaPagamentoValue) {
            const newData = {
                id: allData.length + 1,
                name: formaPagamentoValue
            };
            allData.push(newData);
            filteredData = [...allData];

            // Atualiza a página se o novo registro for na página atual
            if (allData.length > (currentPage * rowsPerPage)) {
                // Se o total de registros exceder o número máximo de registros por página, atualize a página atual
                renderTable();
            } else {
                // Se não houver necessidade de paginação, atualize a tabela diretamente
                renderTable();
            }

            saveTableToLocalStorage(); // Salva no localStorage
            formaPagamentoInput.value = '';
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
        }
    });

    editInput.addEventListener('input', function() {
        if (editInput.value.length > 50) {
            editInput.value = editInput.value.slice(0, 50); // Trunca o valor para 50 caracteres
        }
    });

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedValue = editInput.value.trim();

        if (updatedValue) {
            rowToEdit.children[1].textContent = updatedValue;
            const rowId = rowToEdit.children[0].textContent;
            allData = allData.map(data =>
                data.id == rowId ? { id: data.id, name: updatedValue } : data
            );
            filteredData = filteredData.map(data =>
                data.id == rowId ? { id: data.id, name: updatedValue } : data
            );
            editModal.style.display = 'none';
            saveTableToLocalStorage(); // Salva no localStorage
            renderTable();
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            const rowId = rowToDelete.children[0].textContent;
            allData = allData.filter(data => data.id != rowId);
            filteredData = filteredData.filter(data => data.id != rowId);
            tableBody.removeChild(rowToDelete);
            saveTableToLocalStorage(); // Salva no localStorage
            confirmationModal.style.display = 'none';
            renderTable();
        }
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener('click', function() {
        if ((currentPage * rowsPerPage) < filteredData.length) {
            currentPage++;
            renderTable();
        }
    });

    // Carrega a tabela do localStorage quando a página é carregada
    loadTableFromLocalStorage();
});
