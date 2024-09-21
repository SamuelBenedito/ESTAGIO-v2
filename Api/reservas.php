<?php
require_once 'config.php';

// Create (Criar reserva)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data_reserva = $_POST['data_reserva'];
    $idUsuario = $_POST['idUsuario'];
    $idFormaPag = $_POST['idFormaPag'];
    $idTema = $_POST['idTema'];
    $idClientes = $_POST['idClientes'];
    
    $stmt = $conn->prepare("INSERT INTO RESERVA (data_reserva, idUsuario, idFormaPag, idTema, idClientes) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("siiii", $data_reserva, $idUsuario, $idFormaPag, $idTema, $idClientes);
    $stmt->execute();
    
    echo "Reserva criada com sucesso!";
}

// Read (Listar reservas)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM RESERVA");
    $reservas = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($reservas);
}

// Update (Atualizar reserva)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $idReserva = $_PUT['idReserva'];
    $data_reserva = $_PUT['data_reserva'];
    
    $stmt = $conn->prepare("UPDATE RESERVA SET data_reserva = ? WHERE idReserva = ?");
    $stmt->bind_param("si", $data_reserva, $idReserva);
    $stmt->execute();
    
    echo "Reserva atualizada com sucesso!";
}

// Delete (Excluir reserva)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $idReserva = $_DELETE['idReserva'];
    
    $stmt = $conn->prepare("DELETE FROM RESERVA WHERE idReserva = ?");
    $stmt->bind_param("i", $idReserva);
    $stmt->execute();
    
    echo "Reserva excluída com sucesso!";
}

$conn->close();
?>
