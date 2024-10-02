<?php
// Conexão com o banco de dados
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'estagio';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die('Erro de conexão: ' . $conn->connect_error);
}

// Recebe os dados da requisição
$data = json_decode(file_get_contents("php://input"), true);
$cliente = $data['cliente'];

// Deleta a reserva no banco
$sql = "DELETE r
        FROM RESERVA r
        JOIN CLIENTES c ON r.idClientes = c.idClientes
        WHERE c.nome = '$cliente'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
