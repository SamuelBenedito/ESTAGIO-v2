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
$valor = $_POST['valor']; // Valor da reserva, se necessário

// Validação e inserção no banco de dados
$sql = "INSERT INTO RESERVA (data_reserva, idClientes, idFormaPag, idTema, vlr_reserva) 
        VALUES ('$day', 
                (SELECT idClientes FROM CLIENTES WHERE nome = '$cliente'),
                (SELECT idFormaPag FROM FORMA_PAGAMENTO WHERE nome = '$formaPag'),
                (SELECT idTema FROM TEMA WHERE nome = '$tema'),
                '$valor')";

if ($conn->query($sql) === TRUE) {
    echo "Reserva cadastrada com sucesso!";
} else {
    echo "Erro ao cadastrar reserva: " . $conn->error;
}

$conn->close();
?>
