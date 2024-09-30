<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include 'db_connect.php'; // Include your database connection

$testId = isset($_GET['testId']) ? intval($_GET['testId']) : 0;

if ($testId > 0) {
  $stmt = $conn->prepare('SELECT * FROM questions WHERE testId = ?');
  $stmt->bind_param('i', $testId);
  $stmt->execute();
  $result = $stmt->get_result();

  $questions = [];
  while ($row = $result->fetch_assoc()) {
    $questions[] = [
      'questionId' => $row['questionId'],
      'text' => $row['text'],
      'option1' => $row['option1'],
      'option2' => $row['option2'],
      'option3' => $row['option3'],
      'option4' => $row['option4'],
      'correctOption' => $row['correctOption'] // Ensure this field is present in your database
    ];
  }

  echo json_encode(['success' => true, 'questions' => $questions]);
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid testId']);
}

$conn->close();
