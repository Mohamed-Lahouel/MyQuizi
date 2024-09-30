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

// Get and decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check if required fields are present
if (!$data || !isset($data['email']) || !isset($data['password'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

// Sanitize input
$email = $conn->real_escape_string($data['email']);
$password = $data['password']; // Password will be checked against hashed value in database

// Prepare and execute query
$query = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($query);

// Check if user exists
if ($result->num_rows === 0) {
  echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
  $conn->close();
  exit();
}

// Fetch user data
$user = $result->fetch_assoc();

// Verify password
if (password_verify($password, $user['password'])) {
  // Exclude the password from the response
  unset($user['password']);
  echo json_encode(['success' => true, 'user' => $user]);
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}

// Close database connection
$conn->close();
