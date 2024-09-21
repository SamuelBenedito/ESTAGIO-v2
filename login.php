<?php
require_once 'config.php';

// Verifica se o método de requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica se os dados esperados estão presentes
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $nome = $_POST['username']; // Mudado de 'userType' para 'username'
        $senha = $_POST['password'];

        // Prepara a consulta para verificar o usuário no banco de dados
        $stmt = $conn->prepare("SELECT * FROM USUARIOS WHERE nome = ? AND senha = ?");
        $stmt->bind_param("ss", $nome, $senha);
        
        // Executa a consulta
        if ($stmt->execute()) {
            $result = $stmt->get_result();

            // Verifica se encontrou um usuário
            if ($result->num_rows > 0) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos']);
            }
        } else {
            // Caso ocorra um erro na execução da consulta
            echo json_encode(['success' => false, 'message' => 'Erro na execução da consulta.']);
        }

        // Fecha a consulta
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    }

    // Fecha a conexão
    $conn->close();
} else {
    // Se não for uma requisição POST
    echo json_encode(['success' => false, 'message' => 'Método inválido.']);
}
?>
