document.addEventListener("DOMContentLoaded", () => {
    console.log('Página carregada'); // Log para indicar que a página foi carregada
    const servicesTableBody = document.getElementById("servicesTableBody");
    const exportExcelButton = document.getElementById("exportExcelButton");
    const exportPDFButton = document.getElementById("exportPDFButton");
    const searchService = document.getElementById("searchSevico"); // Corrigido para 'searchSevico'
    let services = [];

    // Função para buscar serviços
    function fetchServices() {
        fetch('servicos.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                services = data;
                console.log("Serviços carregados:", services); // Log para verificar os serviços carregados
                renderServices();
            })
            .catch(error => console.error('Erro ao buscar serviços:', error));
    }

    // Função para renderizar serviços na tabela
    function renderServices() {
           
        const filteredServices = filterServices(searchService.value);
        filteredServices.forEach((service, index) => {
            
        });
    
        // Mostra mensagem se não houver resultados
        const noResultsMessage = document.getElementById("noResultsMessage");
        if (filteredServices.length === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }
    }

    // Função para filtrar serviços
    function filterServices(searchTerm) {
        const filtered = services.filter(service =>
            service.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log("Filtrando serviços com o termo:", searchTerm, "Resultado:", filtered); // Log para verificação
        return filtered;
    }

    // Função para exportar para Excel
    function exportToExcel() {
        console.log("Tentando exportar para Excel");
        const filteredServices = filterServices(searchService.value); // Usa a função de filtro de serviços
        console.log("Exportando para Excel...");

        if (filteredServices.length === 0) {
            alert("Nenhum serviço para exportar!");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(filteredServices);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Serviços");
        XLSX.writeFile(wb, "servicos.xlsx");
    }

    // Função para exportar para PDF
    function exportToPDF() {
        console.log("Tentando exportar para PDF");
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
            console.error("jsPDF não está disponível.");
            return;
        }
        
        const doc = new jsPDF();
        const margin = 10;
        const lineHeight = 7; // Reduzido para economizar espaço
        const columnWidth = { nome: 50, descricao: 60, valor: 30, brinquedos: 25 }; // Ajustado
        const pageWidth = 200;
        const yStart = 20;
    
        const filteredServices = filterServices(searchService.value);
        console.log("Exportando para PDF...");
    
        if (filteredServices.length === 0) {
            alert("Nenhum serviço para exportar!");
            return;
        }
    
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Serviços", margin, yStart);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, margin, yStart + 10);
        doc.setDrawColor(0, 0, 0);
        doc.line(margin, yStart + 15, pageWidth - margin, yStart + 15);
    
        let y = yStart + 25;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Nome", margin, y);
        doc.text("Descrição", margin + columnWidth.nome, y);
        doc.text("Valor", margin + columnWidth.nome + columnWidth.descricao, y);
        doc.text("Brinquedos", margin + columnWidth.nome + columnWidth.descricao + columnWidth.valor, y);
        y += lineHeight;
    
        doc.line(margin, y, pageWidth - margin, y);
        y += lineHeight;
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        filteredServices.forEach((service) => {
            doc.text(service.nome, margin, y);
            doc.text(service.descricao, margin + columnWidth.nome, y);
            doc.text(String(service.valor), margin + columnWidth.nome + columnWidth.descricao, y);
            doc.text(service.liberacao_brinquedos ? 'Sim' : 'Não', margin + columnWidth.nome + columnWidth.descricao + columnWidth.valor, y);
            y += lineHeight;
    
            if (y > 270) {
                doc.addPage();
                y = margin;
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text("Nome", margin, y);
                doc.text("Descrição", margin + columnWidth.nome, y);
                doc.text("Valor", margin + columnWidth.nome + columnWidth.descricao, y);
                doc.text("Brinquedos", margin + columnWidth.nome + columnWidth.descricao + columnWidth.valor, y);
                y += lineHeight;
                doc.line(margin, y, pageWidth - margin, y);
                y += lineHeight;
            }
        });
    
        doc.setFontSize(8);
        doc.text("Gerado por Salão System", margin, 290);
        doc.save("servicos.pdf");
    }

    // Eventos
    exportExcelButton.addEventListener("click", exportToExcel);
    exportPDFButton.addEventListener("click", exportToPDF);
    searchService.addEventListener("input", renderServices);

    // Inicializa buscando serviços
    fetchServices();
});