<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db_connect.php';  // Include your database connection script

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (isset($data['testId'], $data['userId'], $data['reason'], $data['description'])) {
    $testId = intval($data['testId']);
    $userId = intval($data['userId']);
    $reason = $conn->real_escape_string($data['reason']);
    $description = $conn->real_escape_string($data['description']);

    $sql = "INSERT INTO reports (testId, userId, reason, description) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiss", $testId, $userId, $reason, $description);

    if ($stmt->execute()) {
      echo json_encode(['success' => true, 'message' => 'Report submitted successfully.']);
    } else {
      echo json_encode(['success' => false, 'message' => 'Failed to submit report.']);
    }

    $stmt->close();
  } else {
    echo json_encode(['success' => false, 'message' => 'Incomplete data.']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
