document.addEventListener("DOMContentLoaded", () => {
    const clientForm = document.getElementById("clientForm");
    const clientsTableBody = document.getElementById("clientsTableBody");
    const searchCliente = document.getElementById("searchCliente");
    const noResultsMessage = document.getElementById("noResultsMessage");
    const itemsPerPage = 10;
    let currentPage = 1;
    let clients = [];
    let editingClientId = null;

    // Função para buscar clientes
    function fetchClients() {
        return fetch('clientes.php')
            .then(response => response.json())
            .then(data => {
                clients = data;
                renderClients();
            })
            .catch(error => console.error('Erro ao buscar clientes:', error));
    }

    // Função para renderizar clientes na tabela
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

    // Função para formatar telefone
    function formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '')
            .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
            .replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    // Função para formatar CPF
    function formatCPF(cpf) {
        return cpf.replace(/\D/g, '')
            .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    // Função para filtrar clientes
    function filterClients(searchTerm) {
        return clients.filter(client =>
            client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.telefone.includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.cpf.includes(searchTerm)
        );
    }

    // Função para atualizar a paginação
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        document.getElementById("pageNumber").textContent = `Página ${currentPage} de ${totalPages}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;
    }

    // Função para cadastrar cliente
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
        .then(response => response.json())
        .then(data => {
            fetchClients();
            clientForm.reset();
            editingClientId = null;
        })
        .catch(error => console.error('Erro ao cadastrar cliente:', error));
    });

    // Função para exportar para Excel
    function exportToExcel() {
        console.log("Tentando exportar para Excel");
        const filteredClients = filterClients(searchCliente.value);
        console.log("Exportando para Excel...");

        if (filteredClients.length === 0) {
            alert("Nenhum cliente para exportar!");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(filteredClients);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");
        XLSX.writeFile(wb, "clientes.xlsx");
    }

    // Função para exportar para PDF
    function exportToPDF() {
        console.log("Tentando exportar para PDF");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const margin = 10;
        const lineHeight = 10;
        const columnWidth = { name: 60, phone: 40, email: 60, cpf: 40 };
        const pageWidth = 200;
        const yStart = 20;

        const filteredClients = filterClients(searchCliente.value);
        console.log("Exportando para PDF...");

        if (filteredClients.length === 0) {
            alert("Nenhum cliente para exportar!");
            return;
        }

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Clientes", margin, yStart);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, yStart + 10);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yStart + 15, pageWidth - margin, yStart + 15);

        let y = yStart + 25;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Cliente", margin, y);
        doc.text("Telefone", margin + columnWidth.name, y);
        doc.text("Email", margin + columnWidth.name + columnWidth.phone, y);
        doc.text("CPF", margin + columnWidth.name + columnWidth.phone + columnWidth.email, y);
        y += lineHeight;

        doc.line(margin, y, pageWidth - margin, y);
        y += lineHeight;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        filteredClients.forEach((client) => {
            doc.text(client.nome, margin, y);
            doc.text(client.telefone, margin + columnWidth.name, y);
            doc.text(client.email, margin + columnWidth.name + columnWidth.phone, y);
            doc.text(client.cpf, margin + columnWidth.name + columnWidth.phone + columnWidth.email, y);
            y += lineHeight;

            if (y > 270) {
                doc.addPage();
                y = margin;
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Cliente", margin, y);
                doc.text("Telefone", margin + columnWidth.name, y);
                doc.text("Email", margin + columnWidth.name + columnWidth.phone, y);
                doc.text("CPF", margin + columnWidth.name + columnWidth.phone + columnWidth.email, y);
                y += lineHeight;
                doc.line(margin, y, pageWidth - margin, y);
                y += lineHeight;
            }
        });

        doc.setFontSize(8);
        doc.text("Gerado por Salão System", margin, 290);
        doc.save("clientes.pdf");
    }

    // Função para editar cliente
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
            .then(response => response.json())
            .then(data => {
                fetchClients();
                closeEditClientModal();
            })
            .catch(error => console.error('Erro ao editar cliente:', error));
        });
    };

    // Função para confirmar exclusão de cliente
    window.confirmDeleteClient = function(id) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este cliente?");
        if (confirmDelete) {
            fetch('clientes.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(data => {
                fetchClients();
            })
            .catch(error => console.error('Erro ao excluir cliente:', error));
        }
    };

    // Função para fechar o modal de edição
    window.closeEditClientModal = function() {
        const editClientModal = document.getElementById("editClientModal");
        if (editClientModal) {
            editClientModal.remove();
        }
    };

    // Eventos de navegação
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

    // Adicionando eventos para exportação
    document.getElementById("exportExcelButton").addEventListener("click", exportToExcel);
    document.getElementById("exportPDFButton").addEventListener("click", exportToPDF);

    // Inicializa buscando clientes
    fetchClients();
});