<?php
$servername = "127.0.0.1";  // Endereço do servidor MySQL
$username = "root";         // Usuário padrão do MySQL no XAMPP
$password = "";             // Senha em branco por padrão no XAMPP
$dbname = "estagio";        // O nome do banco de dados que você quer usar

// Criando a conexão sem especificar o banco de dados inicialmente
$conn = new mysqli($servername, $username, $password);

// Verificando a conexão inicial
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Conecta ao banco de dados específico
$conn->select_db($dbname);

// Verifica se está conectado ao banco de dados correto
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados '$dbname': " . $conn->connect_error);
}
?>
