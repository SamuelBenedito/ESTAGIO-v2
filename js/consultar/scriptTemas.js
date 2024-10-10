document.addEventListener("DOMContentLoaded", () => {
    const temasForm = document.getElementById("temasForm");
    const temasTableBody = document.getElementById("temasTableBody");
    const noResultsMessage = document.getElementById("noResultsMessage");
    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("editForm");
    const closeEditModal = document.getElementById("closeEditModal");
    const paginationInfo = document.getElementById("pageInfo");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const searchInput = document.getElementById("searchInput"); // Campo de pesquisa

    let temas = [];
    let editingTemaId = null;
    let currentPage = 1;
    const itemsPerPage = 10;

    // Função para buscar temas
    function fetchTemas() {
        fetch('temas.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                temas = data;
                renderTemas();
            })
            .catch(error => console.error('Erro:', error));
    }

    // Função para renderizar os temas com paginação
    function renderTemas() {
        temasTableBody.innerHTML = "";
        noResultsMessage.style.display = temas.length === 0 ? "block" : "none";

        // Filtrando temas com base na pesquisa
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTemas = temas.filter(tema => tema.nome.toLowerCase().includes(searchTerm));

        // Cálculo de início e fim para a paginação
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTemas = filteredTemas.slice(startIndex, endIndex);

        paginatedTemas.forEach((tema, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${tema.nome}</td>
                <td>
                    <button class="btn btn-edit" onclick="editTema(${startIndex + index})">Alterar</button>
                    <button class="btn btn-delete" onclick="confirmDeleteTema('${tema.idTema}')">Excluir</button>
                </td>
            `;
            temasTableBody.appendChild(row);
        });

        // Atualiza as informações de paginação
        updatePaginationInfo(filteredTemas.length); // Passando o número de temas filtrados
    }

    // Função para atualizar as informações de paginação
    function updatePaginationInfo(filteredCount) {
        const totalPages = Math.ceil(filteredCount / itemsPerPage);
        document.getElementById('pageNumber').textContent = `Página ${currentPage} de ${totalPages}`;

        prevPageButton.disabled = currentPage === 1; // Desabilita botão "Anterior" na primeira página
        nextPageButton.disabled = currentPage === totalPages; // Desabilita botão "Próximo" na última página
    }

    // Evento de pesquisa
    searchInput.addEventListener("input", () => {
        currentPage = 1; // Reseta a página ao pesquisar
        renderTemas(); // Re-renderiza os temas com a pesquisa aplicada
    });

    temasForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const temaData = { temas: event.target.temas.value };

        // Verifica se o tema já existe
        if (temas.some(tema => tema.nome.toLowerCase() === temaData.temas.toLowerCase())) {
            alert("Tema já existe!");
            return;
        }

        fetch('temas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(temaData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            fetchTemas();
            temasForm.reset();
            editingTemaId = null;
        })
        .catch(error => console.error('Erro:', error));
    });

    // Função para abrir o modal de edição
    function openEditModal(tema) {
        editModal.style.display = "block"; // Mostrar o modal
        document.getElementById("editTema").value = tema.nome; // Preencher o campo com o tema atual
    }

    // Função para fechar o modal
    closeEditModal.addEventListener("click", () => {
        editModal.style.display = "none"; // Esconder o modal
    });

    // Evento para enviar o formulário de edição
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const temaData = { temas: event.target.editTema.value };

        // Verifica se o tema já existe (excluindo o atual)
        if (temas.some(tema => tema.nome.toLowerCase() === temaData.temas.toLowerCase() && tema.idTema !== editingTemaId)) {
            alert("Tema já existe!");
            return;
        }

        fetch(`temas.php?id=${editingTemaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(temaData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            fetchTemas(); // Atualiza a lista de temas
            editModal.style.display = "none"; // Esconde o modal
            temasForm.reset(); // Limpa o formulário de cadastro
            editingTemaId = null; // Reseta o ID de edição
        })
        .catch(error => console.error('Erro:', error));
    });

    // Função de edição
    window.editTema = function(index) {
        const tema = temas[index];
        if (!tema) {
            console.error('Tema não encontrado');
            return;
        }

        editingTemaId = tema.idTema; // Guarda o ID do tema a ser editado
        openEditModal(tema); // Abre o modal de edição
    };

    // Função de confirmação de exclusão
    window.confirmDeleteTema = function(id) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este tema?");
        if (confirmDelete) {
            fetch('temas.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                fetchTemas(); // Atualiza a lista de temas
            })
            .catch(error => console.error('Erro:', error));
        }
    };

    // Eventos de navegação de página
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTemas(); // Re-renderiza os temas na nova página
        }
    });

    nextPageButton.addEventListener("click", () => {
        const totalPages = Math.ceil(temas.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTemas(); // Re-renderiza os temas na nova página
        }
    });

    fetchTemas(); // Carrega os temas ao iniciar
});