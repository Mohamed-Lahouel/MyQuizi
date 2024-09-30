<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Include database connection file
include 'db_connect.php';

// Get testId from query parameters
$testId = isset($_GET['testId']) ? intval($_GET['testId']) : 0;

if ($testId > 0) {
  // Prepare and execute SQL query to get the first question for the given testId
  $sql = "SELECT * FROM questions WHERE testId = ? ORDER BY questionId LIMIT 1";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $testId);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $question = $result->fetch_assoc();
    echo json_encode(['success' => true, 'question' => $question]);
  } else {
    echo json_encode(['success' => false, 'message' => 'No questions found for this test.']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid test ID.']);
}

$conn->close();
