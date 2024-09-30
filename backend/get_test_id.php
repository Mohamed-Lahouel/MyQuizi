<?php
header('Content-Type: application/json');
include 'db_connect.php'; // Your database connection file

// Get the subscriptionId from query parameters
$subscriptionId = isset($_GET['subscriptionId']) ? intval($_GET['subscriptionId']) : 0;

if ($subscriptionId > 0) {
  $sql = "SELECT testId FROM subscriptions WHERE subscriptionId = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $subscriptionId);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['testId' => $row['testId']]);
  } else {
    echo json_encode(['testId' => null]);
  }

  $stmt->close();
} else {
  echo json_encode(['testId' => null]);
}

$conn->close();
