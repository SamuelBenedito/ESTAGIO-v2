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
    const searchInput = document.getElementById('searchSevico');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumberDisplay = document.getElementById('pageNumber');

    let rowToDelete;
    let rowToEdit;
    let currentPage = 1;
    const rowsPerPage = 10;
    let filteredData = [];

    // Carregar serviços
    function loadServices() {
        fetch('servicos.php')
            .then(response => response.json())
            .then(data => {
                filteredData = data;
                displayTable();
            })
            .catch(error => console.error('Error:', error));
    }

    // Exibir a tabela com paginação
    function displayTable() {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const dataToDisplay = filteredData.slice(startIndex, endIndex);

        if (dataToDisplay.length > 0) {
            dataToDisplay.forEach((data) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${data.idServico}</td>
                    <td>${data.nome}</td>
                    <td>R$ ${parseFloat(data.valor).toFixed(2)}</td>
                    <td>${data.descricao}</td>
                    <td>${data.liberacao_brinquedos}</td>
                    <td>
                        <button class="btn btn-edit" data-id="${data.idServico}">Alterar</button>
                        <button class="btn btn-delete" data-id="${data.idServico}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(newRow);

                const editButton = newRow.querySelector('.btn-edit');
                const deleteButton = newRow.querySelector('.btn-delete');

                editButton.addEventListener('click', function() {
                    openEditModal(data);
                });

                deleteButton.addEventListener('click', function() {
                    rowToDelete = data.idServico;
                    confirmationModal.style.display = 'flex';
                });
            });

            document.getElementById('noResultsMessage').style.display = 'none';
        } else {
            document.getElementById('noResultsMessage').style.display = 'block';
        }

        updatePaginationButtons();
    }

    // Atualizar botões de paginação
    function updatePaginationButtons() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage * rowsPerPage >= filteredData.length;
        pageNumberDisplay.textContent = `Página ${currentPage}`;
    }

    // Pesquisar serviços
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.trim().toLowerCase();
        filteredData = filteredData.filter(data =>
            data.nome.toLowerCase().includes(searchValue) ||
            data.descricao.toLowerCase().includes(searchValue) ||
            data.valor.toString().toLowerCase().includes(searchValue) ||
            data.liberacao_brinquedos.toLowerCase().includes(searchValue)
        );
        currentPage = 1;
        displayTable();
    });

    // Paginação anterior
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    // Próxima página
    nextPageBtn.addEventListener('click', function() {
        if (currentPage * rowsPerPage < filteredData.length) {
            currentPage++;
            displayTable();
        }
    });

    // Adicionar serviço
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nomeValue = document.getElementById('servicos').value.trim();
        const valorValue = document.getElementById('valor').value.trim().replace('R$', '').replace(',', '.');
        const descricaoValue = document.getElementById('descricao').value.trim();
        const brinquedosValue = document.getElementById('sim').checked ? 'SIM' : 'NÃO';

        if (nomeValue && valorValue && descricaoValue && brinquedosValue) {
            const newService = {
                nome: nomeValue,
                descricao: descricaoValue,
                valor: parseFloat(valorValue),
                brinquedos: brinquedosValue
            };

            fetch('servicos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newService)
            })
            .then(response => response.json())
            .then(() => {
                loadServices();
                form.reset();
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    // Abrir modal de edição
    function openEditModal(data) {
        rowToEdit = data.idServico;
        editInputNome.value = data.nome;
        editInputValor.value = data.valor;
        editInputDescricao.value = data.descricao;
        if (data.liberacao_brinquedos === 'SIM') {
            editInputBrinquedosSim.checked = true;
        } else {
            editInputBrinquedosNao.checked = true;
        }
        editModal.style.display = 'block';
    }

    // Salvar edições
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedNome = editInputNome.value.trim();
        const updatedValor = editInputValor.value.trim().replace('R$', '').replace(',', '.');
        const updatedDescricao = editInputDescricao.value.trim();
        const updatedBrinquedos = editInputBrinquedosSim.checked ? 'SIM' : 'NÃO';

        if (updatedNome && updatedValor && updatedDescricao && updatedBrinquedos) {
            const updatedService = {
                id: rowToEdit,
                nome: updatedNome,
                descricao: updatedDescricao,
                valor: parseFloat(updatedValor),
                brinquedos: updatedBrinquedos
            };

            fetch('servicos.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedService)
            })
            .then(response => response.json())
            .then(() => {
                editModal.style.display = 'none';
                loadServices();
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Confirmar exclusão
    confirmYes.addEventListener('click', function() {
        fetch(`servicos.php?id=${rowToDelete}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            confirmationModal.style.display = 'none';
            loadServices();
        })
        .catch(error => console.error('Error:', error));
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    // Carregar serviços ao iniciar
    loadServices();
});