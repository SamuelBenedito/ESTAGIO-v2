<?php
include 'config.php';

header('Content-Type: application/json');

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        $sql = "SELECT * FROM TEMA";
        $result = $conn->query($sql);
        $temas = [];

        while ($row = $result->fetch_assoc()) {
            $temas[] = $row;
        }
        echo json_encode($temas);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $nome = $conn->real_escape_string($data['temas']); // Correct field name
        
        $sql = "INSERT INTO TEMA (nome) VALUES ('$nome')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Tema cadastrado com sucesso!", "id" => $conn->insert_id]);
        } else {
            echo json_encode(["message" => "Erro ao cadastrar tema: " . $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'];
        $nome = $conn->real_escape_string($data['temas']); // Correct field name
        
        $sql = "UPDATE TEMA SET nome='$nome' WHERE idTema=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Tema atualizado com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao atualizar tema: " . $conn->error]);
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];

        $sql = "DELETE FROM TEMA WHERE idTema = $id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Tema excluído com sucesso!"]);
        } else {
            echo json_encode(["message" => "Erro ao excluir tema: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["message" => "Método não suportado"]);
        break;
}

$conn->close();
?>
