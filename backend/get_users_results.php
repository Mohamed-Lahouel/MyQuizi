<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Database connection
include('db_connect.php');

$testId = $_GET['testId'];

if (isset($testId)) {
  $stmt = $conn->prepare("SELECT users.username, users.email, subscriptions.score, subscriptions.subscriptionId
                            FROM subscriptions
                            JOIN users ON subscriptions.userId = users.idUser
                            WHERE subscriptions.testId = ?");
  $stmt->bind_param("i", $testId);
  $stmt->execute();
  $result = $stmt->get_result();

  $userResults = [];
  while ($row = $result->fetch_assoc()) {
    $userResults[] = $row;
  }

  echo json_encode($userResults);
} else {
  echo json_encode(['success' => false, 'message' => 'Test ID not provided.']);
}

$conn->close();
