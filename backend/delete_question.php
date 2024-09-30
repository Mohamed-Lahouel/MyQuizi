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

// Get question ID from request
$data = json_decode(file_get_contents('php://input'), true);

// Check if required fields are present
if (!$data || !isset($data['questionId'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

// Sanitize input
$questionId = $conn->real_escape_string($data['questionId']);

// Prepare and execute query to delete the question
$query = "DELETE FROM questions WHERE questionId='$questionId'";
$result = $conn->query($query);

if ($result) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to delete question']);
}

// Close database connection
$conn->close();
