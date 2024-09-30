<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include 'db_connect.php'; // Include your database connection

$subscriptionId = isset($_GET['subscriptionId']) ? intval($_GET['subscriptionId']) : 0;

if ($subscriptionId > 0) {
  $stmt = $conn->prepare('SELECT * FROM user_answers WHERE subscriptionId = ?');
  $stmt->bind_param('i', $subscriptionId);
  $stmt->execute();
  $result = $stmt->get_result();

  $answers = $result->fetch_all(MYSQLI_ASSOC);

  echo json_encode(['success' => true, 'answers' => $answers]);
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid subscriptionId']);
}

$conn->close();
