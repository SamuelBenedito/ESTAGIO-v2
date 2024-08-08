document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formasPagamentoForm');
    const tableBody = document.querySelector('.formasPagamento-table tbody');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editInput = document.getElementById('editFormaPagamento');
    const closeEditModal = document.getElementById('closeEditModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    let rowToDelete;
    let rowToEdit;

    // Função para salvar a tabela no localStorage
    function saveTableToLocalStorage() {
        const rows = tableBody.querySelectorAll('tr');
        const tableData = Array.from(rows).map(row => ({
            id: row.children[0].textContent,
            name: row.children[1].textContent
        }));
        localStorage.setItem('formasPagamento', JSON.stringify(tableData));
    }

    // Função para carregar a tabela do localStorage
    function loadTableFromLocalStorage() {
        const storedData = localStorage.getItem('formasPagamento');
        if (storedData) {
            const tableData = JSON.parse(storedData);
            tableData.forEach(data => {
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
        }
    }

    // Carrega a tabela do localStorage quando a página é carregada
    loadTableFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const formaPagamentoInput = document.getElementById('formasPagamento');
        const formaPagamentoValue = formaPagamentoInput.value.trim();

        if (formaPagamentoValue) {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = tableBody.rows.length + 1;
            nomeCell.textContent = formaPagamentoValue;

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

            saveTableToLocalStorage(); // Salva no localStorage
            formaPagamentoInput.value = '';
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
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
            rowToEdit.children[1].textContent = updatedValue;
            editModal.style.display = 'none';
            saveTableToLocalStorage(); // Salva no localStorage
        } else {
            alert('Por favor, insira o nome da forma de pagamento.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            tableBody.removeChild(rowToDelete);
            saveTableToLocalStorage(); // Salva no localStorage
            confirmationModal.style.display = 'none';
        }
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
});
