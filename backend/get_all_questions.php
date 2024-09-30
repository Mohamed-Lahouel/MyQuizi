<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database connection details
$host = 'localhost';
$db = 'qcm';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get testId from query parameters
$testId = isset($_GET['testId']) ? intval($_GET['testId']) : 0;

if ($testId > 0) {
  // Prepare and execute SQL query to get all questions for the given testId
  $sql = "SELECT * FROM questions WHERE testId = ? ORDER BY questionId";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $testId);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $questions = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'questions' => $questions]);
  } else {
    echo json_encode(['success' => false, 'message' => 'No questions found for this test.']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid test ID.']);
}

$conn->close();
