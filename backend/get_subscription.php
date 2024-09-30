<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include 'db_connect.php'; // Include your database connection

$subscriptionId = isset($_GET['subscriptionId']) ? intval($_GET['subscriptionId']) : 0;

if ($subscriptionId > 0) {
  $stmt = $conn->prepare('SELECT testId, score FROM subscriptions WHERE subscriptionId = ?');
  $stmt->bind_param('i', $subscriptionId);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
      'testId' => $row['testId'],
      'score' => $row['score'] // Include the score in the response
    ]);
  } else {
    echo json_encode(['testId' => null, 'score' => null]);
  }

  $stmt->close();
} else {
  echo json_encode(['testId' => null, 'score' => null]);
}

$conn->close();
