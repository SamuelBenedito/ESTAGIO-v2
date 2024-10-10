<?php
// Ativar relatórios de erro
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Conexão com o banco de dados
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'estagio';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $conn->connect_error]));
}

// Recebe os dados do formulário
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action']; // Adicione um campo de ação

// Verifica a ação
if ($action === 'check') {
    $day = $conn->real_escape_string($data['day']);
    
    // Verifica se já existe uma reserva no mesmo dia e horário
    $sql_check = "SELECT * FROM RESERVA WHERE data_reserva = '$day'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        echo json_encode(['available' => false, 'message' => 'Já existe uma reserva nesse dia e horário.']);
    } else {
        echo json_encode(['available' => true]);
    }
    exit;
}

// Coleta os dados da reserva
$cliente = $conn->real_escape_string($data['cliente']);
$tema = $conn->real_escape_string($data['tema']);
$formaPag = $conn->real_escape_string($data['formaPag']);
$day = $conn->real_escape_string($data['day']);
$valor = $conn->real_escape_string($data['valor']);
$brinquedo = $conn->real_escape_string($data['brinquedo']);
$servico = $conn->real_escape_string($data['servico']);
$obs = $conn->real_escape_string($data['obs']);

// Verificação de preenchimento dos dados (opcional)
if (empty($cliente) || empty($tema) || empty($formaPag) || empty($day) || empty($valor)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha todos os campos obrigatórios.']);
    exit;
}

// Validação e inserção no banco de dados
$sql = "INSERT INTO RESERVA (data_reserva, idClientes, idFormaPag, idTema, idBrinquedos, idServico, vlr_reserva, obs) 
        VALUES ('$day', 
                (SELECT idClientes FROM CLIENTES WHERE nome = '$cliente'),
                (SELECT idFormaPag FROM FORMA_PAGAMENTO WHERE nome = '$formaPag'),
                (SELECT idTema FROM TEMA WHERE nome = '$tema'),
                (SELECT idBrinquedos FROM BRINQUEDOS WHERE nome = '$brinquedo'),
                (SELECT idServico FROM SERVICO WHERE nome = '$servico'),
                '$valor',
                '$obs')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Reserva cadastrada com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar reserva: ' . $conn->error]);
}

$conn->close();
?>