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

$idReserva = $data['idReserva'];
$cliente = $data['cliente'];
$tema = $data['tema'];
$servico = $data['servico'];
$brinquedos = $data['brinquedos'];
$formaPag = $data['formaPag'];
$day = $data['day'];
$valor = $data['valor'];
$obs = $data['obs'];

// Extrai apenas a data para comparação
$dateOnly = date('Y-m-d', strtotime($day));

// Verifica se já existe uma reserva no mesmo dia (exceto a atual)
$sql_check = "SELECT * FROM RESERVA WHERE DATE(data_reserva) = '$dateOnly' AND idReserva != '$idReserva'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe uma reserva para esta data.']);
} else {
    // Atualiza os dados da reserva no banco usando o idReserva
    $sql = "UPDATE RESERVA 
            SET data_reserva = '$day',
                vlr_reserva = '$valor',
                obs = '$obs',
                idClientes = (SELECT idClientes FROM CLIENTES WHERE nome = '$cliente'),
                idFormaPag = (SELECT idFormaPag FROM FORMA_PAGAMENTO WHERE nome = '$formaPag'),
                idBrinquedos = (SELECT idBrinquedos FROM BRINQUEDOS WHERE nome = '$brinquedos'),
                idServico = (SELECT idServico FROM SERVICO WHERE nome = '$servico'),
                idTema = (SELECT idTema FROM TEMA WHERE nome = '$tema')
            WHERE idReserva = '$idReserva'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

$conn->close();
?>