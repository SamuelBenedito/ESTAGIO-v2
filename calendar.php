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

// Consulta para buscar as reservas
$sql = "SELECT r.data_reserva AS day, 
               c.nome AS cliente, 
               t.nome AS tema, 
               f.nome AS formaPag, 
               r.vlr_reserva AS valor, 
               r.obs AS observacao 
        FROM RESERVA r
        JOIN CLIENTES c ON r.idClientes = c.idClientes
        JOIN TEMA t ON r.idTema = t.idTema
        JOIN FORMA_PAGAMENTO f ON r.idFormaPag = f.idFormaPag";

$result = $conn->query($sql);

$events = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = [
            'title' => $row['cliente'],
            'start' => $row['day'],
            'extendedProps' => [
                'tema' => $row['tema'],
                'servico' => $row['formaPag'],  // Mantendo 'servico' para consistência
                'formaPag' => $row['formaPag'],  // Incluindo a forma de pagamento separadamente
                'valor' => $row['valor'],
                'obs' => $row['observacao'] ? $row['observacao'] : ''
            ]
        ];
    }
}

// Retorna os eventos em formato JSON
header('Content-Type: application/json');
echo json_encode($events);

$conn->close();
?>
