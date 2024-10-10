document.addEventListener('DOMContentLoaded', function () {
    console.log('teste');
    const form = document.getElementById('clientForm');
    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }
    
    const valorInput = document.getElementById('valor');
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
        const brinquedo = document.getElementById('brinquedo').value;
        const servico = document.getElementById('servico').value;
        const obs = document.getElementById('obs').value;
        
        const valor = parseCurrency(valorInput.value);

        // Verifica a disponibilidade da reserva
        fetch("reservas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: 'check', day, cliente }), // Envia a data e o cliente para checar
        })
        .then(response => response.json())
        .then(result => {
            if (result.available) {
                // Se a reserva estiver disponível, continue com a inserção
                return fetch("reservas.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: 'add',
                        cliente,
                        tema,
                        formaPag,
                        day,
                        valor,
                        brinquedo,
                        servico,
                        obs
                    }),
                });
            } else {
                alert("Já existe uma reserva nesse dia e horário.");
            }
        })
        .then(response => {
            if (response) {
                return response.json();
            }
        })
        .then(result => {
            if (result && result.success) {
                alert(result.message);
                form.reset();
            } else if (result) {
                alert(result.message);
            }
        })
        .catch(error => console.error("Erro ao verificar a disponibilidade: ", error));
    });
});