document.addEventListener("DOMContentLoaded", () => {
    // Funções e variáveis do formulário de clientes
    const clientForm = document.getElementById("clientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const clientInput = document.getElementById("cliente");
    const suggestionsContainer = document.getElementById("suggestions");
    let clients = JSON.parse(localStorage.getItem("clients")) || [];

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

    function filterClients(query) {
        return clients.filter(client => client.cliente.toLowerCase().includes(query.toLowerCase()));
    }

    function showSuggestions(suggestions) {
        suggestionsContainer.innerHTML = "";
        if (suggestions.length > 0) {
            suggestions.forEach(client => {
                const suggestionItem = document.createElement("div");
                suggestionItem.className = "autocomplete-suggestion";
                suggestionItem.textContent = client.cliente;
                suggestionItem.addEventListener("click", () => {
                    clientInput.value = client.cliente;
                    suggestionsContainer.innerHTML = "";
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
        }
    }

    clientInput.addEventListener("input", () => {
        const query = clientInput.value;
        if (query.length > 0) {
            const suggestions = filterClients(query);
            showSuggestions(suggestions);
        } else {
            suggestionsContainer.innerHTML = "";
        }
    });

    renderClients();

    // Funções e variáveis da dropzone
    const dropzoneBox = document.getElementsByClassName("dropzone-box")[0];
    const inputFiles = document.querySelectorAll(".dropzone-area input[type='file']");
    const inputElement = inputFiles[0];
    const dropZoneElement = inputElement.closest(".dropzone-area");

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("dropzone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("dropzone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("dropzone--over");
    });

    const updateDropzoneFileList = (dropzoneElement, file) => {
        let dropzoneFileMessage = dropzoneElement.querySelector(".file-info");
        dropzoneFileMessage.innerHTML = `
            ${file.name}, ${file.size} bytes
        `;
    };

    dropzoneBox.addEventListener("reset", (e) => {
        let dropzoneFileMessage = dropZoneElement.querySelector(".file-info");
        dropzoneFileMessage.innerHTML = `Nenhum Arquivo Selecionado`;
    });

    dropzoneBox.addEventListener("submit", (e) => {
        e.preventDefault();
        const myFile = document.getElementById("upload-file");
        console.log(myFile.files[0]);
    });
});
