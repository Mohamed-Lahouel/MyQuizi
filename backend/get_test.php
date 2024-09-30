<?php
include 'db_connect.php';

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$testId = $_GET['id'] ?? '';

if ($testId) {
  $stmt = $conn->prepare('SELECT * FROM qcm_tests WHERE testId = ?');
  $stmt->bind_param('i', $testId);
  $stmt->execute();
  $result = $stmt->get_result();
  $test = $result->fetch_assoc();

  if ($test) {
    echo json_encode(['success' => true, 'test' => $test]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Test not found']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid test ID']);
}
