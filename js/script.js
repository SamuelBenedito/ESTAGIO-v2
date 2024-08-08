// Função para abrir o modal de informações do usuário
function openUserInfoModal() {
  var modal = document.getElementById("userInfoModal");
  modal.style.display = "block";
}

// Função para fechar o modal de informações do usuário
function closeUserInfoModal() {
  var modal = document.getElementById("userInfoModal");
  modal.style.display = "none";
}

// Função para alternar a exibição do dropdown de consulta
function toggleDropdown() {
  var dropdown = document.getElementById("dropdown");
  var dropdownRelatorios = document.getElementById("dropdownRelatorios");
  
  // Fechar o dropdown de relatórios se estiver aberto
  if (dropdownRelatorios.style.display === "block") {
      dropdownRelatorios.style.display = "none";
  }
  
  // Alternar o dropdown de consultas
  dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
}

// Função para alternar a exibição do dropdown de relatórios
function toggleRelatorioDropdown() {
  var dropdown = document.getElementById("dropdown");
  var dropdownRelatorios = document.getElementById("dropdownRelatorios");
  
  // Fechar o dropdown de consultas se estiver aberto
  if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
  }
  
  // Alternar o dropdown de relatórios
  dropdownRelatorios.style.display = (dropdownRelatorios.style.display === "none" || dropdownRelatorios.style.display === "") ? "block" : "none";
}

// Função para alternar a exibição do dropdown de usuário
function toggleUserDropdown() {
  var dropdown = document.getElementById("userDropdown");
  dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
}

// Funções para os botões da barra
function cadastrar() {
  // Lógica para cadastrar
  alert('Cadastrar');
}

function excluir() {
  // Lógica para excluir
  alert('Excluir');
}
