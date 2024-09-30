<?php
// Include the database connection file
include 'db_connect.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Allow cross-origin requests (optional)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the raw POST data
$data = file_get_contents('php://input');
$decodedData = json_decode($data, true);

$userId = isset($decodedData['userId']) ? $decodedData['userId'] : null;
$username = isset($decodedData['username']) ? $decodedData['username'] : null;
$password = isset($decodedData['password']) ? $decodedData['password'] : null;

if ($userId === null || $username === null) {
  echo json_encode(['success' => false, 'message' => 'Missing username, user ID, or password.']);
  exit();
}

// Sanitize inputs
$userId = intval($userId);
$username = mysqli_real_escape_string($conn, $username);

// Initialize the query
$sql = "UPDATE users SET username = ?";

// Bind parameters for password update
if ($password !== '') {
  // Hash the new password
  $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
  $sql .= ", password = ?";
}

// Complete the query
$sql .= " WHERE idUser = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
  echo json_encode(['success' => false, 'message' => 'Query preparation failed.']);
  exit();
}

// Bind parameters
if ($password !== '') {
  $stmt->bind_param('ssi', $username, $hashedPassword, $userId);
} else {
  $stmt->bind_param('si', $username, $userId);
}

if ($stmt->execute()) {
  echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
} else {
  echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
