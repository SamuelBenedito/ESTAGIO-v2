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
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    const ws = XLSX.utils.json_to_sheet(clients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    let y = 10;

    // Adiciona cabeçalho
    doc.text("Clientes", 10, y);
    y += 10;
    doc.text("Cliente | Telefone | Email | CPF", 10, y);
    y += 10;

    // Adiciona cada cliente
    clients.forEach((client) => {
        doc.text(`${client.cliente} | ${client.telefone} | ${client.email} | ${client.cpf}`, 10, y);
        y += 10;
    });

    doc.save("clientes.pdf");
}
