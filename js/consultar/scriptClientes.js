document.addEventListener("DOMContentLoaded", () => {
    const clientForm = document.getElementById("clientForm");
    const editClientForm = document.getElementById("editClientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const editClientModal = document.getElementById("editClientModal");
    const confirmDeleteDialog = document.getElementById("confirmDeleteDialog");
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    let currentEditIndex = null;
    let deleteIndex = null;

    function saveClientsToLocalStorage() {
        localStorage.setItem("clients", JSON.stringify(clients));
    }

    function renderClients() {
        clientsTableBody.innerHTML = "";
        clients.forEach((client, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${client.cliente}</td>
                <td>${client.telefone}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
                <td>
                    <button class="btn btn-edit" onclick="editClient(${index})">Alterar</button>
                    <button class="btn btn-delete" onclick="confirmDeleteClient(${index})">Excluir</button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });
    }

    window.editClient = function(index) {
        currentEditIndex = index;
        const client = clients[index];
        document.getElementById("editCliente").value = client.cliente;
        document.getElementById("editTelefone").value = client.telefone;
        document.getElementById("editEmail").value = client.email;
        document.getElementById("editCpf").value = client.cpf;
        editClientModal.style.display = "flex";
    };

    window.closeEditClientModal = function() {
        editClientModal.style.display = "none";
    };

    window.confirmDeleteClient = function(index) {
        deleteIndex = index;
        confirmDeleteDialog.style.display = "flex";
    };

    window.closeConfirmDeleteDialog = function() {
        confirmDeleteDialog.style.display = "none";
    };

    document.getElementById("confirm-yes").addEventListener("click", () => {
        clients.splice(deleteIndex, 1);
        saveClientsToLocalStorage();
        renderClients();
        closeConfirmDeleteDialog();
    });

    document.getElementById("confirm-no").addEventListener("click", closeConfirmDeleteDialog);

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

    editClientForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const updatedClient = {
            cliente: event.target.cliente.value,
            telefone: event.target.telefone.value,
            email: event.target.email.value,
            cpf: event.target.cpf.value
        };
        clients[currentEditIndex] = updatedClient;
        saveClientsToLocalStorage();
        renderClients();
        closeEditClientModal();
    });

    renderClients();
});