document.addEventListener("DOMContentLoaded", () => {
    const clientForm = document.getElementById("clientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const searchCliente = document.getElementById("searchCliente");
    const noResultsMessage = document.getElementById("noResultsMessage");
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    const itemsPerPage = 10; // Ajustado para 10
    let currentPage = 1;

    function saveClientsToLocalStorage() {
        localStorage.setItem("clients", JSON.stringify(clients));
    }

    function renderClients() {
        clientsTableBody.innerHTML = "";
        const filteredClients = filterClients(searchCliente.value);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedClients = filteredClients.slice(start, end);

        if (paginatedClients.length === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }

        paginatedClients.forEach((client, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${client.cliente}</td>
                <td>${client.telefone}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
                <td>
                    <button class="btn btn-edit" onclick="editClient(${clients.indexOf(client)})">Alterar</button>
                    <button class="btn btn-delete" onclick="confirmDeleteClient(${clients.indexOf(client)})">Excluir</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });

        updatePagination(filteredClients.length);
    }

    function filterClients(searchTerm) {
        return clients.filter(client =>
            client.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.telefone.includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.cpf.includes(searchTerm)
        );
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        document.getElementById("pageNumber").textContent = `Página ${currentPage} de ${totalPages}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;
    }

    window.editClient = function(index) {
        const client = clients[index];
        const editFormHtml = `
            <div id="editClientModal" class="modal">
                <div class="modal-content">
                    <h2>Editar Cliente</h2>
                    <form id="editClientForm">
                        <div class="form-group">
                            <label for="editCliente">Cliente:</label>
                            <input type="text" id="editCliente" name="cliente" value="${client.cliente}" required>
                        </div>
                        <div class="form-group">
                            <label for="editTelefone">Telefone:</label>
                            <input type="text" id="editTelefone" name="telefone" value="${client.telefone}" required>
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email:</label>
                            <input type="email" id="editEmail" name="email" value="${client.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="editCpf">CPF:</label>
                            <input type="text" id="editCpf" name="cpf" value="${client.cpf}" required>
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
            clients[index] = {
                cliente: event.target.cliente.value,
                telefone: event.target.telefone.value,
                email: event.target.email.value,
                cpf: event.target.cpf.value
            };
            saveClientsToLocalStorage();
            renderClients();
            closeEditClientModal();
        });
    };

    window.closeEditClientModal = function() {
        const editClientModal = document.getElementById("editClientModal");
        editClientModal.parentNode.removeChild(editClientModal);
    };

    window.confirmDeleteClient = function(index) {
        const confirmDialogHtml = `
            <div id="confirmDeleteDialog" class="confirmation-dialog">
                <div class="confirmation-dialog-content">
                    <p>Tem certeza que deseja excluir este cliente?</p>
                    <button id="confirm-yes">Sim</button>
                    <button id="confirm-no">Não</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', confirmDialogHtml);

        const confirmDeleteDialog = document.getElementById("confirmDeleteDialog");
        confirmDeleteDialog.style.display = "flex";

        document.getElementById("confirm-yes").addEventListener("click", () => {
            clients.splice(index, 1);
            saveClientsToLocalStorage();
            renderClients();
            closeConfirmDeleteDialog();
        });

        document.getElementById("confirm-no").addEventListener("click", closeConfirmDeleteDialog);
    };

    window.closeConfirmDeleteDialog = function() {
        const confirmDeleteDialog = document.getElementById("confirmDeleteDialog");
        confirmDeleteDialog.parentNode.removeChild(confirmDeleteDialog);
    };

    clientForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newClient = {
            cliente: event.target.cliente.value,
            telefone: event.target.telefone.value,
            email: event.target.email.value,
            cpf: event.target.cpf.value
        };
        clients.push(newClient);
        saveClientsToLocalStorage();
        renderClients();
        event.target.reset();
    });

    searchCliente.addEventListener("input", () => {
        currentPage = 1; // Reset to the first page when searching
        renderClients();
    });

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderClients();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        const totalPages = Math.ceil(filterClients(searchCliente.value).length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderClients();
        }
    });

    // Load initial clients in batches of 10
    function loadInitialClients() {
        // For demonstration, assuming `clients` could be initially empty
        if (clients.length === 0) {
            for (let i = 0; i < 10; i++) {
                // Sample client data, replace with actual data
                clients.push({
                    cliente: `Cliente ${i + 1}`,
                    telefone: `12345678${i}`,
                    email: `cliente${i + 1}@example.com`,
                    cpf: `123.456.789-${i}`
                });
            }
            saveClientsToLocalStorage();
        }
        renderClients();
    }

    loadInitialClients();
});