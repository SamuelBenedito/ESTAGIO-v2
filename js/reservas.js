document.addEventListener('DOMContentLoaded', function () {
    console.log('etste')
    const form = document.getElementById('clientForm');
    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }
    
    const valorInput = document.getElementById('valor');
    const brinquedoInput = document.getElementById('brinquedo'); // Adiciona o campo de brinquedos

    if (!valorInput) {
        console.error('Campo de valor não encontrado');
        return;
    }

    // Função para aplicar máscara de moeda (R$)
    function formatCurrency(value) {
        value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
        value = (value / 100).toFixed(2) + ""; // Converte para formato decimal
        value = value.replace(".", ","); // Substitui o ponto por vírgula
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Coloca ponto como separador de milhar
        return "R$ " + value;
    }

    // Aplica a máscara no campo de valor
    valorInput.addEventListener('input', function () {
        valorInput.value = formatCurrency(valorInput.value);
    });

    // Função para desformatar o valor da moeda
    function parseCurrency(value) {
        return parseFloat(value.replace('R$ ', '').replace('.', '').replace(',', '.'));
    }

    // Manipula o envio do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Coleta os dados do formulário
        const cliente = document.getElementById('cliente').value;
        const tema = document.getElementById('tema').value;
        const formaPag = document.getElementById('formaPag').value;
        const day = document.getElementById('day').value;
        const brinquedo = document.getElementById('brinquedo').value; // Coleta o valor do campo brinquedo
        const servico = document.getElementById('servico').value;
        const obs = document.getElementById('obs').value;
        
        const valor = parseCurrency(valorInput.value);

        // Envia os dados para o PHP via AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'reservas.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText); // Exibe a mensagem de sucesso ou erro
                // Limpa o formulário após o envio
                form.reset();
            }
        };

        // Formata os dados para envio
        const data = `cliente=${encodeURIComponent(cliente)}&tema=${encodeURIComponent(tema)}&formaPag=${encodeURIComponent(formaPag)}&day=${encodeURIComponent(day)}&valor=${encodeURIComponent(valor)}&brinquedo=${encodeURIComponent(brinquedo)}&servico=${encodeURIComponent(servico)}&obs=${encodeURIComponent(obs)}`;

        // Loga os dados antes do envio
        console.log("Dados enviados: ", data); // Aqui você verá os dados que estão sendo enviados

        xhr.send(data);
    });
});
