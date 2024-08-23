// Função para abrir o modal
function openModal() {
    document.getElementById('acoesModal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('acoesModal').style.display = 'none';
}

// Funções para os botões de ação
function editarItem() {
    alert("Editar item");
    closeModal();
}

function excluirItem() {
    alert("Excluir item");
    closeModal();
}

// Adicionando o evento ao botão AÇÕES na tabela
document.querySelectorAll('#clientesTable tbody tr td a').forEach(function(button) {
    button.addEventListener('click', openModal);
});
