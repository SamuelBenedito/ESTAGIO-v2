document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('servicosForm');
    const tableBody = document.querySelector('.servicos-table tbody');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editInputNome = document.getElementById('editServico');
    const editInputValor = document.getElementById('editValor');
    const editInputDescricao = document.getElementById('editDescricao');
    const editInputBrinquedosSim = document.getElementById('editBrinquedosSim');
    const editInputBrinquedosNao = document.getElementById('editBrinquedosNao');
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
            name: row.children[1].textContent,
            valor: row.children[2].textContent,
            descricao: row.children[3].textContent,
            brinquedos: row.children[4].textContent
        }));
        localStorage.setItem('servicos', JSON.stringify(tableData));
    }

    // Função para carregar a tabela do localStorage
    function loadTableFromLocalStorage() {
        const storedData = localStorage.getItem('servicos');
        if (storedData) {
            const tableData = JSON.parse(storedData);
            tableData.forEach(data => {
                const newRow = document.createElement('tr');
                const idCell = document.createElement('td');
                const nomeCell = document.createElement('td');
                const valorCell = document.createElement('td');
                const descricaoCell = document.createElement('td');
                const brinquedosCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                idCell.textContent = data.id;
                nomeCell.textContent = data.name;
                valorCell.textContent = data.valor;
                descricaoCell.textContent = data.descricao;
                brinquedosCell.textContent = data.brinquedos;

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
                newRow.appendChild(valorCell);
                newRow.appendChild(descricaoCell);
                newRow.appendChild(brinquedosCell);
                newRow.appendChild(actionsCell);

                tableBody.appendChild(newRow);
            });
        }
    }

    // Carrega a tabela do localStorage quando a página é carregada
    loadTableFromLocalStorage();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const servicoInput = document.getElementById('servicos');
        const valorInput = document.getElementById('valor');
        const descricaoInput = document.getElementById('descricao');
        const brinquedosSimInput = document.getElementById('sim');
        const brinquedosNaoInput = document.getElementById('nao');

        const servicoValue = servicoInput.value.trim();
        const valorValue = valorInput.value.trim();
        const descricaoValue = descricaoInput.value.trim();
        const brinquedosValue = brinquedosSimInput.checked ? 'SIM' : (brinquedosNaoInput.checked ? 'NÃO' : '');

        if (servicoValue && valorValue && descricaoValue && brinquedosValue) {
            const newRow = document.createElement('tr');
            const idCell = document.createElement('td');
            const nomeCell = document.createElement('td');
            const valorCell = document.createElement('td');
            const descricaoCell = document.createElement('td');
            const brinquedosCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = tableBody.rows.length + 1;
            nomeCell.textContent = servicoValue;
            valorCell.textContent = valorValue;
            descricaoCell.textContent = descricaoValue;
            brinquedosCell.textContent = brinquedosValue;

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
            newRow.appendChild(valorCell);
            newRow.appendChild(descricaoCell);
            newRow.appendChild(brinquedosCell);
            newRow.appendChild(actionsCell);

            tableBody.appendChild(newRow);

            saveTableToLocalStorage(); // Salva no localStorage
            servicoInput.value = '';
            valorInput.value = '';
            descricaoInput.value = '';
            brinquedosSimInput.checked = false;
            brinquedosNaoInput.checked = false;
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    function openEditModal(row) {
        rowToEdit = row;
        editInputNome.value = row.children[1].textContent;
        editInputValor.value = row.children[2].textContent;
        editInputDescricao.value = row.children[3].textContent;
        const brinquedosValue = row.children[4].textContent.trim();
        if (brinquedosValue === 'SIM') {
            editInputBrinquedosSim.checked = true;
            editInputBrinquedosNao.checked = false;
        } else if (brinquedosValue === 'NÃO') {
            editInputBrinquedosSim.checked = false;
            editInputBrinquedosNao.checked = true;
        }
        editModal.style.display = 'block';
    }

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedNome = editInputNome.value.trim();
        const updatedValor = editInputValor.value.trim();
        const updatedDescricao = editInputDescricao.value.trim();
        const updatedBrinquedos = editInputBrinquedosSim.checked ? 'SIM' : (editInputBrinquedosNao.checked ? 'NÃO' : '');

        if (updatedNome && updatedValor && updatedDescricao && updatedBrinquedos) {
            rowToEdit.children[1].textContent = updatedNome;
            rowToEdit.children[2].textContent = updatedValor;
            rowToEdit.children[3].textContent = updatedDescricao;
            rowToEdit.children[4].textContent = updatedBrinquedos;
            editModal.style.display = 'none';
            saveTableToLocalStorage(); // Salva no localStorage
        } else {
            alert('Por favor, preencha todos os campos.');
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
