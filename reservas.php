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

// Recebe os dados do formulário
$cliente = $_POST['cliente'];
$tema = $_POST['tema'];
$formaPag = $_POST['formaPag'];
$day = $_POST['day'];
$valor = $_POST['valor'];
$brinquedo = $_POST['brinquedo'];
$servico = $_POST['servico'];

// Verificação de preenchimento dos dados (opcional)
if (empty($cliente) || empty($tema) || empty($formaPag) || empty($day) || empty($valor)) {
    die('Por favor, preencha todos os campos obrigatórios.');
}

// Validação e inserção no banco de dados
$sql = "INSERT INTO RESERVA (data_reserva, idClientes, idFormaPag, idTema, idBrinquedos, idServico, vlr_reserva) 
        VALUES ('$day', 
                (SELECT idClientes FROM CLIENTES WHERE nome = '$cliente'),
                (SELECT idFormaPag FROM FORMA_PAGAMENTO WHERE nome = '$formaPag'),
                (SELECT idTema FROM TEMA WHERE nome = '$tema'),
                (SELECT idBrinquedos FROM BRINQUEDOS WHERE nome = '$brinquedo'),
                (SELECT idServico FROM SERVICO WHERE nome = '$servico'),
                '$valor')";

if ($conn->query($sql) === TRUE) {
    echo "Reserva cadastrada com sucesso!";
} else {
    echo "Erro ao cadastrar reserva: " . $conn->error;
}

$conn->close();

?>
