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

$idReserva = $data['idReserva']; // Pega o idReserva do evento a ser atualizado
$cliente = $data['cliente'];
$tema = $data['tema'];
$servico = $data['servico'];
$brinquedos = $data['brinquedos'];
$formaPag = $data['formaPag'];
$day = $data['day'];
$valor = $data['valor'];
$obs = $data['obs'];

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

$conn->close();
?>