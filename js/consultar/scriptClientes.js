document.addEventListener("DOMContentLoaded", () => {
    const clientForm = document.getElementById("clientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const searchCliente = document.getElementById("searchCliente");
    const noResultsMessage = document.getElementById("noResultsMessage");
    const itemsPerPage = 10;
    let currentPage = 1;
    let clients = [];
    let editingClientId = null;

    function fetchClients() {
        fetch('clientes.php')
            .then(response => response.json())
            .then(data => {
                clients = data;
                renderClients();
            })
            .catch(error => console.error('Erro:', error));
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
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let sum, remainder;
        for (let i = 1; i <= 9; i++) {
            sum = (sum || 0) + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

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

        noResultsMessage.style.display = paginatedClients.length === 0 ? "block" : "none";

        paginatedClients.forEach((client, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${client.nome}</td>
                <td>${formatPhoneNumber(client.telefone)}</td>
                <td>${client.email}</td>
                <td>${formatCPF(client.cpf)}</td>
                <td>
                    <button class="btn btn-edit" onclick="editClient(${start + index})">Alterar</button>
                    <button class="btn btn-delete" onclick="confirmDeleteClient('${client.idClientes}')">Excluir</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });

        updatePagination(filteredClients.length);
    }

    function filterClients(searchTerm) {
        return clients.filter(client =>
            client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    clientForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const clientData = {
            nome: event.target.cliente.value,
            telefone: event.target.telefone.value,
            email: event.target.email.value,
            cpf: event.target.cpf.value
        };

        if (!isValidCPF(clientData.cpf)) {
            showError(["CPF inválido"]);
            return;
        }

        const duplicateErrors = checkDuplicate(clientData);
        if (duplicateErrors.length > 0) {
            showError(duplicateErrors);
            return;
        }

        const method = editingClientId ? 'PUT' : 'POST';
        const url = editingClientId ? `clientes.php?id=${editingClientId}` : 'clientes.php';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
        .then(response => response.json())
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

            if (!isValidCPF(updatedClient.cpf)) {
                showError(["CPF inválido"]);
                return;
            }

            const duplicateErrors = checkDuplicate(updatedClient, index);
            if (duplicateErrors.length > 0) {
                showError(duplicateErrors);
                return;
            }

            fetch(`clientes.php?id=${editingClientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedClient)
            })
            .then(response => response.json())
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
            .then(response => response.json())
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

    fetchClients();
});

document.getElementById('telefone').addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('cpf').addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
});