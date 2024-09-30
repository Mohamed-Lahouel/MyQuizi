<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust this for production to allow only specific origins
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
include 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$testId = $data['testId'];

if (!$testId) {
  echo json_encode(['success' => false, 'message' => 'Test ID is missing.']);
  exit();
}

$stmt = $conn->prepare("SELECT * FROM questions WHERE testId = ?");
$stmt->bind_param("i", $testId);
$stmt->execute();
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
  $questions[] = $row;
}

echo json_encode(['success' => true, 'questions' => $questions]);

$stmt->close();
$conn->close();
