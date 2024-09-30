<?php
// request_role_change.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php'; // Include your database connection file

$data = json_decode(file_get_contents("php://input"));

if (isset($data->idUser)) {
  $idUser = $data->idUser;

  // Insert a new request record
  $stmt = $conn->prepare("INSERT INTO role_requests (idUser, status) VALUES (?, 'pending')");
  $stmt->bind_param("i", $idUser);

  if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Role change request submitted successfully.']);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit role change request.']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}

$conn->close();
