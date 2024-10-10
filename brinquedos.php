<?php
include 'config.php';

header('Content-Type: application/json');

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        $sql = "SELECT * FROM BRINQUEDOS";
        $result = $conn->query($sql);
        $brinquedos = [];

        while ($row = $result->fetch_assoc()) {
            $brinquedos[] = $row;
        }
        echo json_encode($brinquedos);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $nome = $conn->real_escape_string($data['brinquedos']);

        // Verifica se o brinquedo já existe
        $checkSQL = "SELECT * FROM BRINQUEDOS WHERE nome='$nome'";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Brinquedo já cadastrado!"]);
            exit;
        }

        $sql = "INSERT INTO BRINQUEDOS (nome) VALUES ('$nome')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Brinquedo cadastrado com sucesso!", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["message" => "Erro ao cadastrar brinquedo: " . $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'];
        $nome = $conn->real_escape_string($data['brinquedos']);

        // Verifica se o brinquedo já existe (exceto o atual)
        $checkSQL = "SELECT * FROM BRINQUEDOS WHERE nome='$nome' AND idBrinquedos != $id";
        $checkResult = $conn->query($checkSQL);
        if ($checkResult->num_rows > 0) {
            echo json_encode(["message" => "Brinquedo já cadastrado!"]);
            exit;
        }

        $sql = "UPDATE BRINQUEDOS SET nome='$nome' WHERE idBrinquedos=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Brinquedo atualizado com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar brinquedo: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $sql = "DELETE FROM BRINQUEDOS WHERE idBrinquedos = $id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Brinquedo excluído com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao excluir brinquedo: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

$conn->close();
?>