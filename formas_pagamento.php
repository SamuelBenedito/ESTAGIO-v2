<?php
include 'config.php';

header('Content-Type: application/json');

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        $sql = "SELECT * FROM FORMA_PAGAMENTO";
        $result = $conn->query($sql);
        $formasPagamento = [];

        while ($row = $result->fetch_assoc()) {
            $formasPagamento[] = $row;
        }
        echo json_encode($formasPagamento);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $nome = $conn->real_escape_string($data['formasPagamento']);
        
        // Verifica se a forma de pagamento já existe
        $checkSQL = "SELECT * FROM FORMA_PAGAMENTO WHERE nome='$nome'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Forma de pagamento já cadastrada!"]);
            exit;
        }

        $sql = "INSERT INTO FORMA_PAGAMENTO (nome) VALUES ('$nome')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Forma de pagamento cadastrada com sucesso!", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["message" => "Erro ao cadastrar forma de pagamento: " . $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'];
        $nome = $conn->real_escape_string($data['formasPagamento']);
        
        // Verifica se a forma de pagamento já existe (exceto a atual)
        $checkSQL = "SELECT * FROM FORMA_PAGAMENTO WHERE nome='$nome' AND idFormaPag != $id";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Forma de pagamento já cadastrada!"]);
            exit;
        }

        $sql = "UPDATE FORMA_PAGAMENTO SET nome='$nome' WHERE idFormaPag=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Forma de pagamento atualizada com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar forma de pagamento: " . $conn->error]);
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $sql = "DELETE FROM FORMA_PAGAMENTO WHERE idFormaPag = $id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Forma de pagamento excluída com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao excluir forma de pagamento: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

$conn->close();
?>