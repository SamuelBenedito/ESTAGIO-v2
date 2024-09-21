<?php
require_once 'config.php';

// Create (Cadastrar cliente)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $telefone = $_POST['telefone'];
    $cpf = $_POST['cpf'];
    $email = $_POST['email'];
    
    $stmt = $conn->prepare("INSERT INTO CLIENTES (nome, telefone, cpf, email) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $telefone, $cpf, $email);
    $stmt->execute();
    
    echo "Cliente criado com sucesso!";
}

// Read (Listar clientes)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM CLIENTES");
    $clientes = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($clientes);
}

// Update (Atualizar cliente)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $idClientes = $_PUT['idClientes'];
    $nome = $_PUT['nome'];
    $telefone = $_PUT['telefone'];
    
    $stmt = $conn->prepare("UPDATE CLIENTES SET nome = ?, telefone = ? WHERE idClientes = ?");
    $stmt->bind_param("ssi", $nome, $telefone, $idClientes);
    $stmt->execute();
    
    echo "Cliente atualizado com sucesso!";
}

// Delete (Excluir cliente)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $idClientes = $_DELETE['idClientes'];
    
    $stmt = $conn->prepare("DELETE FROM CLIENTES WHERE idClientes = ?");
    $stmt->bind_param("i", $idClientes);
    $stmt->execute();
    
    echo "Cliente excluído com sucesso!";
}

$conn->close();
?>
