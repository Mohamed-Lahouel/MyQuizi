<?php
// Allow requests from any origin (you can restrict this to specific domains)
header("Access-Control-Allow-Origin: *");

// Allow specific methods and headers if necessary
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests for methods other than GET and POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // For preflight requests, just send the headers and exit
  exit;
}

// Include database connection
include 'db_connect.php';

// Read the input data
$data = json_decode(file_get_contents("php://input"), true);
$questionText = $data['text'] ?? null;
$option1 = $data['option1'] ?? null;
$option2 = $data['option2'] ?? null;
$option3 = $data['option3'] ?? null;
$option4 = $data['option4'] ?? null;
$correctOption = $data['correctOption'] ?? null;
$testId = $data['testId'] ?? null;

// Validate input
if ($testId && $questionText && $option1 && $option2 && $option3 && $option4 && $correctOption) {
  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO questions (testId, text, option1, option2, option3, option4, correctOption) VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("issssss", $testId, $questionText, $option1, $option2, $option3, $option4, $correctOption);

  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

// Close the database connection
$conn->close();
