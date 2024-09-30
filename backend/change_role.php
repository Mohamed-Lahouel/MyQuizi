<?php
// Allow requests from any origin (adjust as needed for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow methods you need
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(); // Stop processing for preflight requests
}

header("Content-Type: application/json; charset=UTF-8");

include_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

// Check if the data contains the required fields
if (isset($data->idUser) && isset($data->newRole)) {
  $idUser = $data->idUser;
  $newRole = $data->newRole;

  // Validate role
  $validRoles = ['admin', 'teacher', 'student'];
  if (!in_array($newRole, $validRoles)) {
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit();
  }

  // Prepare the SQL statement
  $stmt = $conn->prepare("UPDATE users SET role = ? WHERE idUser = ?");
  if ($stmt === false) {
    echo json_encode(['success' => false, 'message' => 'Error preparing statement']);
    exit();
  }

  // Bind parameters
  $stmt->bind_param('si', $newRole, $idUser);

  // Execute the statement
  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Error updating role']);
  }

  // Close the statement
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

// Close the database connection
$conn->close();
