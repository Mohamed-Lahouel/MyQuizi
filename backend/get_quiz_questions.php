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

// Get test ID from request body
$data = json_decode(file_get_contents('php://input'), true);

// Check if required fields are present
if (!$data || !isset($data['testId'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
  exit();
}

// Sanitize input
$testId = $conn->real_escape_string($data['testId']);

// Prepare and execute query to fetch questions for the given test ID
$questionsQuery = "SELECT * FROM questions WHERE testId='$testId'";
$questionsResult = $conn->query($questionsQuery);

$questions = [];
if ($questionsResult) {
  while ($row = $questionsResult->fetch_assoc()) {
    $questions[] = $row;
  }
}

if (!empty($questions)) {
  echo json_encode(['success' => true, 'questions' => $questions]);
} else {
  echo json_encode(['success' => false, 'message' => 'No questions found for this test']);
}

// Close database connection
$conn->close();