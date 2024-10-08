<?php
include 'config.php';

header('Content-Type: application/json');

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        $sql = "SELECT * FROM CLIENTES";
        $result = $conn->query($sql);
        $clientes = [];

        while ($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }
        echo json_encode($clientes);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $nome = $conn->real_escape_string($data['nome']);
        $telefone = $conn->real_escape_string($data['telefone']);
        $cpf = $conn->real_escape_string($data['cpf']);
        $email = $conn->real_escape_string($data['email']);

        // Adiciona log para verificar quando a requisição chega
        file_put_contents('log.txt', date('Y-m-d H:i:s') . " - Tentativa de cadastrar: $nome, $telefone, $cpf, $email\n", FILE_APPEND);

        $checkSql = "SELECT * FROM CLIENTES WHERE cpf = '$cpf'";
        $checkResult = $conn->query($checkSql);

        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Cliente já existe!"]);
            break;
        }

        $sql = "INSERT INTO CLIENTES (nome, telefone, cpf, email) VALUES ('$nome', '$telefone', '$cpf', '$email')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Cliente cadastrado com sucesso!", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["message" => "Erro ao cadastrar cliente: " . $conn->error]);
        }
        break;



    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'];
        $nome = $conn->real_escape_string($data['nome']); // Corrigido para 'nome'
        $telefone = $conn->real_escape_string($data['telefone']);
        $cpf = $conn->real_escape_string($data['cpf']);
        $email = $conn->real_escape_string($data['email']);

        $sql = "UPDATE CLIENTES SET nome='$nome', telefone='$telefone', cpf='$cpf', email='$email' WHERE idClientes=$id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Cliente atualizado com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar cliente: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $sql = "DELETE FROM CLIENTES WHERE idClientes = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Cliente excluído com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao excluir cliente: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

$conn->close();
?>