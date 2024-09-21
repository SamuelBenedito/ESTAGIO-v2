document.addEventListener("DOMContentLoaded", () => {
    

    
    const clientForm = document.getElementById("clientForm");

    const clientsTableBody = document.getElementById("clientsTableBody");
    const noResultsMessage = document.getElementById("noResultsMessage");
    const itemsPerPage = 10;
    let currentPage = 1;
    let clients = [];
    let editingClientId = null;

    function fetchClients() {
        fetch('clientes.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                clients = data;
                renderClients();
            })
            .catch(error => console.error('Erro:', error));
    }

    function renderClients() {
        clientsTableBody.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedClients = clients.slice(start, end);

        noResultsMessage.style.display = paginatedClients.length === 0 ? "block" : "none";

        paginatedClients.forEach((client, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${client.nome}</td>
                <td>${client.telefone}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
                <td>
                    <button class="btn btn-edit" onclick="editClient(${start + index})">Alterar</button>
                    <button class="btn btn-delete" onclick="confirmDeleteClient('${client.idClientes}')">Excluir</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });

        updatePagination(clients.length);
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        document.getElementById("pageNumber").innerText = `Página ${currentPage} de ${totalPages}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;

        document.getElementById("prevPage").onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderClients();
            }
        };
        document.getElementById("nextPage").onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderClients();
            }
        };
    }

    clientForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const clientData = {
            nome: event.target.cliente.value,
            telefone: event.target.telefone.value,
            email: event.target.email.value,
            cpf: event.target.cpf.value
        };

        const method = editingClientId ? 'PUT' : 'POST';
        const url = editingClientId ? `clientes.php?id=${editingClientId}` : 'clientes.php';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
        
            fetchClients();
            clientForm.reset();
            editingClientId = null;
        })
        .catch(error => console.error('Erro:', error));
    });

    window.editClient = function(index) {
        const client = clients[index];
        if (!client) {
            console.error('Cliente não encontrado');
            return;
        }

        editingClientId = client.idClientes;

        const editFormHtml = `
            <div id="editClientModal" class="modal">
                <div class="modal-content">
                    <h2>Editar Cliente</h2>
                    <form id="editClientForm">
                        <div class="form-group">
                            <label for="editNome">Nome:</label>
                            <input type="text" id="editNome" name="nome" value="${client.nome}" required maxlength="50">
                        </div>
                        <div class="form-group">
                            <label for="editTelefone">Telefone:</label>
                            <input type="text" id="editTelefone" name="telefone" value="${client.telefone}" required maxlength="11">
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email:</label>
                            <input type="email" id="editEmail" name="email" value="${client.email}" required maxlength="50">
                        </div>
                        <div class="form-group">
                            <label for="editCpf">CPF:</label>
                            <input type="text" id="editCpf" name="cpf" value="${client.cpf}" required maxlength="11">
                        </div>
                        <button type="submit">Salvar</button>
                        <button type="button" class="close-modal" onclick="closeEditClientModal()">Cancelar</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', editFormHtml);
        const editClientModal = document.getElementById("editClientModal");
        editClientModal.style.display = "flex";

        document.getElementById("editClientForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const updatedClient = {
                nome: event.target.nome.value,
                telefone: event.target.telefone.value,
                email: event.target.email.value,
                cpf: event.target.cpf.value
            };

            fetch(`clientes.php?id=${editingClientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedClient)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
            
                fetchClients();
                closeEditClientModal();
            })
            .catch(error => console.error('Erro:', error));
        });
    };

    window.confirmDeleteClient = function(id) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este cliente?");
        if (confirmDelete) {
            fetch('clientes.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
              
                fetchClients();
            })
            .catch(error => console.error('Erro:', error));
        }
    };

    window.closeEditClientModal = function() {
        const editClientModal = document.getElementById("editClientModal");
        if (editClientModal) {
            editClientModal.remove();
        }
    };

    fetchClients();
});
