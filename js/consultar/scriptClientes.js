document.addEventListener("DOMContentLoaded", () => {
    const clientForm = document.getElementById("clientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const searchCliente = document.getElementById("searchCliente");
    const noResultsMessage = document.getElementById("noResultsMessage");
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    const itemsPerPage = 10;
    let currentPage = 1;

    function saveClientsToLocalStorage() {
        localStorage.setItem("clients", JSON.stringify(clients));
    }

    function formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '')
            .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
            .replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    function formatCPF(cpf) {
        return cpf.replace(/\D/g, '')
            .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let sum, remainder;
        for (let i = 1; i <= 9; i++) {
            sum = (sum || 0) + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    }

    function checkDuplicate(client, excludeIndex = -1) {
        const errors = [];
        clients.forEach((c, index) => {
            if (index !== excludeIndex) {
                if (c.email === client.email) errors.push("Email");
                if (c.telefone === client.telefone) errors.push("Telefone");
                if (c.cpf === client.cpf) errors.push("CPF");
            }
        });
        return errors;
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
                <td>${formatPhoneNumber(client.telefone)}</td>
                <td>${client.email}</td>
                <td>${formatCPF(client.cpf)}</td>
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

    function showError(errors) {
        const notification = document.getElementById("notification");
        const notificationMessage = document.getElementById("notificationMessage");

        const message = errors.length
            ? `Os seguintes dados já estão cadastrados: ${errors.join(', ')}.`
            : "Erro desconhecido.";

        notificationMessage.textContent = message;
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 5000);
    }

    function limitInputFields() {
        document.getElementById("editCliente").addEventListener("input", (event) => {
            if (event.target.value.length > 50) {
                event.target.value = event.target.value.slice(0, 50);
            }
        });

        document.getElementById("editTelefone").addEventListener("input", (event) => {
            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11);
        });

        document.getElementById("editEmail").addEventListener("input", (event) => {
            if (event.target.value.length > 50) {
                event.target.value = event.target.value.slice(0, 50);
            }
        });

        document.getElementById("editCpf").addEventListener("input", (event) => {
            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11);
        });
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

        limitInputFields();

        document.getElementById("editClientForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const updatedClient = {
                cliente: event.target.cliente.value,
                telefone: event.target.telefone.value,
                email: event.target.email.value,
                cpf: event.target.cpf.value
            };
            if (!isValidCPF(updatedClient.cpf)) {
                showError(["CPF inválido"]);
                return;
            }
            const duplicateErrors = checkDuplicate(updatedClient, index);
            if (duplicateErrors.length > 0) {
                showError(duplicateErrors);
                return;
            }
            clients[index] = updatedClient;
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

    function closeConfirmDeleteDialog() {
        const confirmDeleteDialog = document.getElementById("confirmDeleteDialog");
        confirmDeleteDialog.parentNode.removeChild(confirmDeleteDialog);
    }

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderClients();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < Math.ceil(clients.length / itemsPerPage)) {
            currentPage++;
            renderClients();
        }
    });

    searchCliente.addEventListener("input", renderClients);

    // Handler for the client registration form
    clientForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newClient = {
            cliente: event.target.cliente.value,
            telefone: event.target.telefone.value,
            email: event.target.email.value,
            cpf: event.target.cpf.value
        };

        if (!isValidCPF(newClient.cpf)) {
            showError(["CPF inválido"]);
            return;
        }

        const duplicateErrors = checkDuplicate(newClient);
        if (duplicateErrors.length > 0) {
            showError(duplicateErrors);
            return;
        }

        clients.push(newClient);
        saveClientsToLocalStorage();
        renderClients();

        // Clear the form fields
        clientForm.reset();
    });

    renderClients();
});

document.getElementById('telefone').addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('cpf').addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
});
