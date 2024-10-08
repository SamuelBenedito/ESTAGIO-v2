<?php
// Define o tipo de retorno como JSON
header('Content-Type: application/json');
// Evita mostrar erros ou avisos
error_reporting(E_ERROR | E_PARSE);

// Conexão com o banco de dados
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'estagio';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Erro de conexão: ' . $conn->connect_error]);
    exit;
}

// Recebe os dados da requisição
$data = json_decode(file_get_contents("php://input"), true);
$idReserva = $data['idReserva']; // Captura o idReserva enviado do frontend

// Verifica se o idReserva foi fornecido
if (!empty($idReserva)) {
    // Deleta a reserva no banco usando o idReserva
    $sql = "DELETE FROM RESERVA WHERE idReserva = $idReserva";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'idReserva não fornecido']);
}

$conn->close();
?>
