<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow GET and POST methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow specific headers

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit; // Exit for OPTIONS requests
}

// Database connection
$host = 'localhost';
$db = 'qcm';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve and sanitize POST data
  $data = json_decode(file_get_contents('php://input'), true);

  // Log received data
  error_log("Received data: " . print_r($data, true));

  $idRequest = $conn->real_escape_string($data['idRequest']);
  $action = $conn->real_escape_string($data['action']);

  if ($action === 'approve') {
    // Log action
    error_log("Processing approve action for request ID: $idRequest");

    // Update user's role to "teacher"
    $query = "UPDATE users SET role = 'teacher' WHERE idUser = (SELECT idUser FROM role_requests WHERE idRequest = '$idRequest')";
    if ($conn->query($query) === TRUE) {
      // Delete the request
      $query = "DELETE FROM role_requests WHERE idRequest = '$idRequest'";
      if ($conn->query($query) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Request approved and user role updated']);
      } else {
        error_log("Failed to delete request ID: $idRequest");
        echo json_encode(['success' => false, 'message' => 'Failed to delete request']);
      }
    } else {
      error_log("Failed to update user role for request ID: $idRequest");
      echo json_encode(['success' => false, 'message' => 'Failed to update user role']);
    }
  } elseif ($action === 'reject') {
    // Log action
    error_log("Processing reject action for request ID: $idRequest");

    // Delete the request
    $query = "DELETE FROM role_requests WHERE idRequest = '$idRequest'";
    if ($conn->query($query) === TRUE) {
      echo json_encode(['success' => true, 'message' => 'Request rejected and deleted']);
    } else {
      error_log("Failed to delete request ID: $idRequest");
      echo json_encode(['success' => false, 'message' => 'Failed to delete request']);
    }
  } else {
    error_log("Invalid action: $action");
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
  }
} else {
  error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
