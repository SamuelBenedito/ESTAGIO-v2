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
    let rowToEdit = null;
    let rowToDelete = null;

    // Função para carregar dados do servidor
    function loadData() {
        fetch('formas_pagamento.php')
            .then(response => response.json())
            .then(data => {
                allData = data;
                filteredData = [...allData];
                renderTable();
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    // Função para renderizar a tabela com dados filtrados e paginados
    function renderTable() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        noResultsMessage.style.display = filteredData.length === 0 ? 'block' : 'none';

        paginatedData.forEach(data => {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = data.idFormaPag;
            nomeCell.textContent = data.nome;

            const editButton = document.createElement('button');
            editButton.textContent = 'Alterar';
            editButton.classList.add('btn', 'btn-edit');
            editButton.addEventListener('click', function() {
                openEditModal(data.idFormaPag);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('btn', 'btn-delete');
            deleteButton.addEventListener('click', function() {
                rowToDelete = data.idFormaPag;
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

    function openEditModal(id) {
        rowToEdit = id;
        const formaPagamento = allData.find(data => data.idFormaPag === id);
        editInput.value = formaPagamento.nome;
        editModal.style.display = 'flex';
    }

    // Função para filtrar dados
    function filterTable() {
        const searchValue = searchInput.value.toLowerCase();
        filteredData = allData.filter(data =>
            data.nome.toLowerCase().includes(searchValue)
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
            // Verifica se o nome já existe
            if (allData.some(data => data.nome.toLowerCase() === formaPagamentoValue.toLowerCase())) {
                alert('Forma de pagamento já cadastrada!');
                return;
            }

            fetch('formas_pagamento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formasPagamento: formaPagamentoValue })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadData();  // Recarrega os dados
                formaPagamentoInput.value = '';
            })
            .catch(error => console.error('Erro ao adicionar:', error));
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
        }
    });

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedValue = editInput.value.trim();

        if (updatedValue) {
            // Verifica se o nome já existe (exceto o atual)
            if (allData.some(data => data.nome.toLowerCase() === updatedValue.toLowerCase() && data.idFormaPag !== rowToEdit)) {
                alert('Forma de pagamento já cadastrada!');
                return;
            }

            fetch(`formas_pagamento.php?id=${rowToEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formasPagamento: updatedValue })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                editModal.style.display = 'none';
                loadData();  // Recarrega os dados
            })
            .catch(error => console.error('Erro ao atualizar:', error));
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            fetch('formas_pagamento.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: rowToDelete })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                confirmationModal.style.display = 'none';
                loadData();  // Recarrega os dados
            })
            .catch(error => console.error('Erro ao excluir:', error));
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

    // Carrega a tabela do servidor quando a página é carregada
    loadData();
});