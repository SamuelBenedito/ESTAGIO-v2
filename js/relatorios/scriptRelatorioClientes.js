document.addEventListener("DOMContentLoaded", () => {
    const clientsTableBody = document.getElementById("clientesTableBody");
    const quantidadeClientes = document.getElementById("quantidadeClientes");

    function renderClients() {
        const clients = JSON.parse(localStorage.getItem("clients")) || [];
        clientsTableBody.innerHTML = "";
        quantidadeClientes.textContent = clients.length;

        clients.forEach((client) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${client.cliente}</td>
                <td>${client.telefone}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
            `;
            clientsTableBody.appendChild(row);
        });
    }

    renderClients();
});

function exportToExcel() {
    // Implementar a função de exportação para Excel
}

function exportToPDF() {
    // Implementar a função de exportação para PDF
}