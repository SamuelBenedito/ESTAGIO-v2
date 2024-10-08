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

// Busca as reservas
$sql = "SELECT c.nome AS cliente, t.nome AS tema, s.nome AS servico, b.nome AS brinquedo, 
               f.nome AS formaPag, r.data_reserva, r.vlr_reserva, r.obs 
        FROM RESERVA r
        JOIN CLIENTES c ON r.idClientes = c.idClientes
        JOIN TEMA t ON r.idTema = t.idTema
        JOIN SERVICO s ON r.idServico = s.idServico
        JOIN BRINQUEDOS b ON r.idBrinquedos = b.idBrinquedos
        JOIN FORMA_PAGAMENTO f ON r.idFormaPag = f.idFormaPag";

$result = $conn->query($sql);
$reservations = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }
}

echo json_encode($reservations);

$conn->close();
?>