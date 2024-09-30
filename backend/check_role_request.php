<?php
// check_role_request.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php'; // Include your database connection file

$idUser = isset($_GET['idUser']) ? intval($_GET['idUser']) : 0;

if ($idUser) {
  $stmt = $conn->prepare("SELECT 1 FROM role_requests WHERE idUser = ? AND status = 'pending'");
  $stmt->bind_param("i", $idUser);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    echo json_encode(['exists' => true]);
  } else {
    echo json_encode(['exists' => false]);
  }

  $stmt->close();
} else {
  echo json_encode(['exists' => false]);
}

$conn->close();
