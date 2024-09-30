<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$confirm_password = $data['confirm_password'] ?? '';
$role = $data['role'] ?? '';

if ($password !== $confirm_password) {
  echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
  exit;
}

$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Check if the username or email already exists
$checkStmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
$checkStmt->bind_param('ss', $username, $email);
$checkStmt->execute();
$checkStmt->bind_result($count);
$checkStmt->fetch();
$checkStmt->close();

if ($count > 0) {
  echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
  exit;
}

// Insert the new user
$stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $username, $email, $passwordHash, $role);

if ($stmt->execute()) {
  echo json_encode(['success' => true, 'message' => 'User added successfully.']);
} else {
  // Log the error message
  error_log("Database error: " . $stmt->error);
  echo json_encode(['success' => false, 'message' => 'Error adding user.']);
}

$stmt->close();
$conn->close();
