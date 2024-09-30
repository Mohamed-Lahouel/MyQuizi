<?php
header('Content-Type: application/json');

// Allow from any origin
header('Access-Control-Allow-Origin: *');
// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Allow methods
header('Access-Control-Allow-Methods: POST');

// Include database connection
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $idUser = $data['idUser'] ?? '';
  $newPassword = $data['newPassword'] ?? '';

  if (empty($idUser) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
  }

  $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

  $stmt = $conn->prepare("UPDATE users SET password = ? WHERE idUser = ?");
  $stmt->bind_param("si", $hashedPassword, $idUser);

  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
  }
  $stmt->close();
  $conn->close();
}
