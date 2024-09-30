<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once 'db_connect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"));

  if (isset($data->idUser)) {
    $idUser = $data->idUser;

    // Prepare and execute delete statement
    $stmt = $conn->prepare("DELETE FROM users WHERE idUser = ?");
    $stmt->bind_param('i', $idUser);

    if ($stmt->execute()) {
      echo json_encode(['success' => true]);
    } else {
      echo json_encode(['success' => false, 'message' => 'Error deleting user']);
    }

    $stmt->close();
  } else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
  }

  $conn->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
