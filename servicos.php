<?php
include 'config.php';

header('Content-Type: application/json');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT * FROM SERVICO";
        $result = $conn->query($sql);
        $services = [];

        while ($row = $result->fetch_assoc()) {
            $services[] = $row;
        }

        echo json_encode($services);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $nome = $data['nome'];
        $descricao = $data['descricao'];
        $valor = $data['valor'];
        $brinquedos = $data['brinquedos'];

        // Verifica se o serviço já existe
        $checkSQL = "SELECT * FROM SERVICO WHERE nome='$nome'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Serviço já cadastrado!"]);
            exit;
        }

        $sql = "INSERT INTO SERVICO (nome, valor, descricao, liberacao_brinquedos) VALUES ('$nome', '$valor', '$descricao', '$brinquedos')";
        $conn->query($sql);

        echo json_encode(["message" => "Serviço adicionado com sucesso"]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $nome = $data['nome'];
        $descricao = $data['descricao'];
        $valor = $data['valor'];
        $brinquedos = $data['brinquedos'];

        // Verifica se o serviço já existe (exceto o atual)
        $checkSQL = "SELECT * FROM SERVICO WHERE nome='$nome' AND idServico != $id";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Serviço já cadastrado!"]);
            exit;
        }

        $sql = "UPDATE SERVICO SET nome='$nome', valor='$valor', descricao='$descricao', liberacao_brinquedos='$brinquedos' WHERE idServico=$id";
        $conn->query($sql);

        echo json_encode(["message" => "Serviço atualizado com sucesso"]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM SERVICO WHERE idServico=$id";
        $conn->query($sql);

        echo json_encode(["message" => "Serviço excluído com sucesso"]);
        break;
}

$conn->close();
?>