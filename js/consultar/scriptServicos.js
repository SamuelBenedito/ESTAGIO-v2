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

    // Função para salvar a tabela no localStorage
    function saveTableToLocalStorage() {
        localStorage.setItem('servicos', JSON.stringify(filteredData));
    }

    // Função para carregar a tabela do localStorage
    function loadTableFromLocalStorage() {
        const storedData = localStorage.getItem('servicos');
        if (storedData) {
            filteredData = JSON.parse(storedData);
            displayTable();
        }
    }

    // Função para exibir a tabela com paginação
    function displayTable() {
        tableBody.innerHTML = '';
    
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
    
        const dataToDisplay = filteredData.slice(startIndex, endIndex);
    
        if (dataToDisplay.length > 0) {
            dataToDisplay.forEach((data, index) => {
                const newRow = document.createElement('tr');
    
                newRow.innerHTML = `
                    <td>${startIndex + index + 1}</td>
                    <td>${data.name}</td>
                    <td>${data.valor}</td>
                    <td>${data.descricao}</td>
                    <td>${data.brinquedos}</td>
                    <td>
                        <button class="btn btn-edit">Alterar</button>
                        <button class="btn btn-delete">Excluir</button>
                    </td>
                `;
    
                tableBody.appendChild(newRow);
    
                const editButton = newRow.querySelector('.btn-edit');
                const deleteButton = newRow.querySelector('.btn-delete');
    
                editButton.addEventListener('click', function() {
                    openEditModal(newRow);
                });
    
                deleteButton.addEventListener('click', function() {
                    rowToDelete = newRow;
                    confirmationModal.style.display = 'flex';
                });
            });
    
            // Esconder a mensagem de nenhum resultado
            document.getElementById('noResultsMessage').style.display = 'none';
        } else {
            tableBody.innerHTML = '<tr><td colspan="6"></td></tr>';
            
            // Mostrar a mensagem de nenhum resultado
            document.getElementById('noResultsMessage').style.display = 'block';
        }
    
        updatePaginationButtons();
    }
    

    // Função para atualizar os botões de paginação
    function updatePaginationButtons() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage * rowsPerPage >= filteredData.length;
        pageNumberDisplay.textContent = `Página ${currentPage}`;
    }

    // Função para realizar a pesquisa na tabela
    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.trim().toLowerCase();

        filteredData = JSON.parse(localStorage.getItem('servicos')).filter(data =>
            data.name.toLowerCase().includes(searchValue) ||
            data.valor.toLowerCase().includes(searchValue) ||
            data.descricao.toLowerCase().includes(searchValue) ||
            data.brinquedos.toLowerCase().includes(searchValue)
        );

        currentPage = 1; // Resetar para a primeira página ao pesquisar
        displayTable();
    });

    // Evento para mudar para a página anterior
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    // Evento para mudar para a próxima página
    nextPageBtn.addEventListener('click', function() {
        if (currentPage * rowsPerPage < filteredData.length) {
            currentPage++;
            displayTable();
        }
    });

    // Carrega a tabela do localStorage quando a página é carregada
    loadTableFromLocalStorage();

    // Função para adicionar novo serviço
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
            const newRow = {
                id: filteredData.length + 1,
                name: servicoValue,
                valor: valorValue,
                descricao: descricaoValue,
                brinquedos: brinquedosValue
            };

            filteredData.push(newRow);
            saveTableToLocalStorage();
            displayTable();

            // Limpar campos de entrada
            servicoInput.value = '';
            valorInput.value = '';
            descricaoInput.value = '';
            brinquedosSimInput.checked = false;
            brinquedosNaoInput.checked = false;
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    // Função para abrir o modal de edição
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

    // Função para salvar as edições
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedNome = editInputNome.value.trim();
        const updatedValor = editInputValor.value.trim();
        const updatedDescricao = editInputDescricao.value.trim();
        const updatedBrinquedos = editInputBrinquedosSim.checked ? 'SIM' : (editInputBrinquedosNao.checked ? 'NÃO' : '');

        if (updatedNome && updatedValor && updatedDescricao && updatedBrinquedos) {
            const index = Array.from(tableBody.children).indexOf(rowToEdit);

            filteredData[index].name = updatedNome;
            filteredData[index].valor = updatedValor;
            filteredData[index].descricao = updatedDescricao;
            filteredData[index].brinquedos = updatedBrinquedos;

            editModal.style.display = 'none';
            saveTableToLocalStorage();
            displayTable();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    closeEditModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Função para confirmar exclusão
    confirmYes.addEventListener('click', function() {
        if (rowToDelete) {
            const index = Array.from(tableBody.children).indexOf(rowToDelete);
            filteredData.splice(index, 1);
            saveTableToLocalStorage();
            confirmationModal.style.display = 'none';
            displayTable();
        }
    });

    confirmNo.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
});
