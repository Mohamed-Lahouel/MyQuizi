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

// Get user ID from request (Assuming user ID is passed in request body)
$data = json_decode(file_get_contents('php://input'), true);

// Check if required fields are present
if (!$data || !isset($data['userId'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

// Sanitize input
$userId = $conn->real_escape_string($data['userId']);

// Prepare and execute query to fetch tests owned by the user
$query = "SELECT * FROM qcm_tests WHERE userId='$userId'";
$result = $conn->query($query);

$tests = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $tests[] = $row; // Ensure `$row` contains 'testId'
  }
  echo json_encode(['success' => true, 'tests' => $tests]);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to retrieve tests']);
}

// Close database connection
$conn->close();
