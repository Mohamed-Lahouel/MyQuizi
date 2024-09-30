<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit; // Exit to avoid further processing
}

header('Content-Type: application/json');
require 'db_connect.php'; // Include the database connection file

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

$username = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Check if the email already exists
$checkEmailQuery = "SELECT * FROM users WHERE email = '$email'";
$emailResult = $conn->query($checkEmailQuery);

if ($emailResult && $emailResult->num_rows > 0) {
  echo json_encode(['success' => false, 'message' => 'Email already used']);
  exit();
}

// If email is not used, proceed with inserting the user
$query = "INSERT INTO users (username, email, password, role) VALUES ('$username', '$email', '$password', 'student')";

if ($conn->query($query) === TRUE) {
  echo json_encode(['success' => true]);
} else {
  // Log the error to a file for debugging
  error_log("Database error: " . $conn->error, 3, "/path/to/your/error.log");
  echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}

$conn->close();
