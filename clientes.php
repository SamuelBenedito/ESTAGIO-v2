<?php
include 'config.php';

header('Content-Type: application/json');

// Função para validar CPF
function isValidCPF($cpf) {
    $cpf = preg_replace('/\D/', '', $cpf); // Remove caracteres não numéricos
    if (strlen($cpf) != 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
        return false; // Verifica se o CPF tem 11 dígitos e não é uma sequência repetida
    }

    // Validação do CPF
    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }
    return true;
}

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

        // Validação do CPF
        if (!isValidCPF($cpf)) {
            echo json_encode(["message" => "CPF inválido!"]);
            break;
        }

        // Verifica se o CPF já existe
        $checkSql = "SELECT * FROM CLIENTES WHERE cpf = '$cpf'";
        $checkResult = $conn->query($checkSql);

        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Cliente com este CPF já existe!"]);
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
        $id = $conn->real_escape_string($_GET['id']);
        $nome = $conn->real_escape_string($data['nome']);
        $telefone = $conn->real_escape_string($data['telefone']);
        $cpf = $conn->real_escape_string($data['cpf']);
        $email = $conn->real_escape_string($data['email']);

        // Validação do CPF
        if (!isValidCPF($cpf)) {
            echo json_encode(["message" => "CPF inválido!"]);
            break;
        }

        // Verifica se o CPF já existe para outro cliente
        $checkSql = "SELECT * FROM CLIENTES WHERE cpf = '$cpf' AND idClientes != $id";
        $checkResult = $conn->query($checkSql);

        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Cliente com este CPF já existe!"]);
            break;
        }

        $sql = "UPDATE CLIENTES SET nome='$nome', telefone='$telefone', cpf='$cpf', email='$email' WHERE idClientes=$id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Cliente atualizado com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar cliente: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $conn->real_escape_string($data['id']);

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