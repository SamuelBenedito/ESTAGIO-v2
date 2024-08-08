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
    dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
  }
  
  // Função para alternar a exibição do dropdown de relatórios
  function toggleRelatorioDropdown() {
    var dropdown = document.getElementById("dropdownRelatorios");
    dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
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
  };
  
  function excluir() {
    // Lógica para excluir
    alert('Excluir');
  };