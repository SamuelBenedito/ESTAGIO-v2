<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'estagio';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die('Erro de conexão: ' . $conn->connect_error);
}

$searchTerm = isset($_GET['term']) ? $_GET['term'] : '';
$table = isset($_GET['table']) ? $_GET['table'] : '';

// Inicializa um array para armazenar os resultados
$results = [];

if ($searchTerm && $table) {
    switch ($table) {
        case 'clientes':
            $sql = "SELECT nome FROM CLIENTES WHERE nome LIKE '%$searchTerm%'";
            break;
        case 'temas':
            $sql = "SELECT nome FROM TEMA WHERE nome LIKE '%$searchTerm%'";
            break;
        case 'servicos':
            $sql = "SELECT nome FROM SERVICO WHERE nome LIKE '%$searchTerm%'";
            break;
        case 'brinquedos':
            $sql = "SELECT nome FROM BRINQUEDOS WHERE nome LIKE '%$searchTerm%'";
            break;
        case 'formas_pagamento':
            $sql = "SELECT nome FROM FORMA_PAGAMENTO WHERE nome LIKE '%$searchTerm%'";
            break;
        default:
            echo json_encode([]);
            exit;
    }

    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $results[] = $row;
        }
    }
}

echo json_encode($results);
$conn->close();
?>