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

function filterClients() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const clientsTableBody = document.getElementById("clientesTableBody");
    const clients = JSON.parse(localStorage.getItem("clients")) || [];

    clientsTableBody.innerHTML = "";

    const filteredClients = clients.filter(client => client.cliente.toLowerCase().includes(searchInput));

    filteredClients.forEach(client => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${client.cliente}</td>
            <td>${client.telefone}</td>
            <td>${client.email}</td>
            <td>${client.cpf}</td>
        `;
        clientsTableBody.appendChild(row);
    });

    // Atualiza a quantidade de clientes filtrados
    document.getElementById("quantidadeClientes").textContent = filteredClients.length;
}



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
    const margin = 10;
    const lineHeight = 10;
    const columnWidth = { name: 60, phone: 40, email: 60, cpf: 40 };
    const pageWidth = 200;
    const yStart = 20; // Start Y position for the content

    // Adiciona o título do relatório
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Clientes", margin, yStart);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, yStart + 10);

    // Adiciona linha de separação
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yStart + 15, pageWidth - margin, yStart + 15);

    let y = yStart + 25;

    // Adiciona título das colunas
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Cliente", margin, y);
    doc.text("Telefone", margin + columnWidth.name, y);
    doc.text("Email", margin + columnWidth.name + columnWidth.phone, y);
    doc.text("CPF", margin + columnWidth.name + columnWidth.phone + columnWidth.email, y);
    y += lineHeight;

    // Adiciona linha de separação
    doc.line(margin, y, pageWidth - margin, y);
    y += lineHeight;

    // Adiciona cada cliente
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    clients.forEach((client) => {
        doc.text(client.cliente, margin, y);
        doc.text(client.telefone, margin + columnWidth.name, y);
        doc.text(client.email, margin + columnWidth.name + columnWidth.phone, y);
        doc.text(client.cpf, margin + columnWidth.name + columnWidth.phone + columnWidth.email, y);
        y += lineHeight;
        
        // Adiciona nova página se necessário
        if (y > 270) {
            doc.addPage();
            y = margin;
            // Re-imprime o cabeçalho na nova página
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

    // Adiciona rodapé
    doc.setFontSize(8);
    doc.text("Gerado por Salão System", margin, 290);

    doc.save("clientes.pdf");
}

