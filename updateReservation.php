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
$tema = $data['tema'];
$servico = $data['servico'];
$brinquedos = $data['brinquedos'];
$formaPag = $data['formaPag'];
$day = $data['day'];
$valor = $data['valor'];
$obs = $data['obs'];
$originalCliente = $data['originalCliente'];

// Atualiza os dados da reserva no banco
$sql = "UPDATE RESERVA r
        JOIN CLIENTES c ON r.idClientes = c.idClientes
        JOIN FORMA_PAGAMENTO f ON r.idFormaPag = f.idFormaPag
        JOIN TEMA t ON r.idTema = t.idTema
        SET r.data_reserva = '$day',
            r.vlr_reserva = '$valor',
            r.obs = '$obs',
            r.idFormaPag = (SELECT idFormaPag FROM FORMA_PAGAMENTO WHERE nome = '$formaPag'),
            r.idTema = (SELECT idTema FROM TEMA WHERE nome = '$tema')
        WHERE c.nome = '$originalCliente'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
