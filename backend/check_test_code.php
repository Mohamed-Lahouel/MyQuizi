<?php
// Allow from any origin
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Include database connection file
require 'db_connect.php';

// Check if 'code' parameter is set in the GET request
if (isset($_GET['code'])) {
  $testCode = $_GET['code'];

  // Prepare a SQL statement to prevent SQL injection
  $stmt = $conn->prepare("SELECT testId FROM qcm_tests WHERE code = ?");
  $stmt->bind_param("s", $testCode);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    // Test code exists, fetch the testId
    $row = $result->fetch_assoc();
    $testId = $row['testId'];
    echo json_encode(['success' => true, 'message' => 'Test code is valid.', 'testId' => $testId]);
  } else {
    // Test code does not exist
    echo json_encode(['success' => false, 'message' => 'Invalid test code.']);
  }

  // Close the statement and the connection
  $stmt->close();
  $conn->close();
} else {
  // Code parameter not set in the request
  echo json_encode(['success' => false, 'message' => 'Test code not provided.']);
}
