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

// Get test ID from request
$data = json_decode(file_get_contents('php://input'), true);

// Check if test ID is provided
if (!isset($data['testId'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

// Sanitize input
$testId = $conn->real_escape_string($data['testId']);

// Prepare and execute query to delete the test
$query = "DELETE FROM qcm_tests WHERE testId='$testId'";
if ($conn->query($query)) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to delete test']);
}

// Close database connection
$conn->close();
