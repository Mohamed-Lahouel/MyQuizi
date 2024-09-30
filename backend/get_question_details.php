<?php
// Include the database connection file
include 'db_connect.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Allow cross-origin requests (optional)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');


$questionId = intval($_GET['questionId']); // Sanitize and validate input

// Prepare SQL query
$sql = "SELECT * FROM questions WHERE questionId = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $questionId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $question = $result->fetch_assoc();
  $response = [
    'success' => true,
    'questions' => [$question]
  ];
} else {
  $response = [
    'success' => false,
    'message' => 'No question found.'
  ];
}

echo json_encode($response);
