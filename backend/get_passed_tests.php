<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db_connect.php';  // Include your database connection script

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['userId'])) {
    $userId = intval($_GET['userId']);
    $sql = "SELECT subscriptions.subscriptionId, qcm_tests.testId, qcm_tests.title, qcm_tests.description, subscriptions.score, subscriptions.takenAt
                FROM subscriptions
                JOIN qcm_tests ON subscriptions.testId = qcm_tests.testId
                WHERE subscriptions.userId = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $tests = [];
    while ($row = $result->fetch_assoc()) {
      $tests[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $tests]);
  } else {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
