<?php
require_once 'config.php';

// Create (Cadastrar usuário)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $tipoUsuario = $_POST['tipoUsuario'];
    
    $stmt = $conn->prepare("INSERT INTO USUARIOS (nome, email, senha, tipoUsuario) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $email, $senha, $tipoUsuario);
    $stmt->execute();
    
    echo "Usuário criado com sucesso!";
}

// Read (Listar usuários)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM USUARIOS");
    $usuarios = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($usuarios);
}

// Update (Atualizar usuário)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $idUsuario = $_PUT['idUsuario'];
    $nome = $_PUT['nome'];
    $email = $_PUT['email'];
    
    $stmt = $conn->prepare("UPDATE USUARIOS SET nome = ?, email = ? WHERE idUsuario = ?");
    $stmt->bind_param("ssi", $nome, $email, $idUsuario);
    $stmt->execute();
    
    echo "Usuário atualizado com sucesso!";
}

// Delete (Excluir usuário)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $idUsuario = $_DELETE['idUsuario'];
    
    $stmt = $conn->prepare("DELETE FROM USUARIOS WHERE idUsuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    
    echo "Usuário excluído com sucesso!";
}

$conn->close();
?>
