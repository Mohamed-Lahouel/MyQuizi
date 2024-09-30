<?php
// Allow requests from any origin (you can restrict this to specific domains)
header("Access-Control-Allow-Origin: *");

// Allow specific methods and headers if necessary
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests for methods other than GET and POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // For preflight requests, just send the headers and exit
  exit;
}

include 'db_connect.php';

// Read the input data
$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'] ?? null;
$description = $data['description'] ?? null;
$userId = $data['userId'] ?? null;

// Validate input
if ($title && $description && $userId) {
  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO qcm_tests (userId, title, description) VALUES (?, ?, ?)");
  $stmt->bind_param("iss", $userId, $title, $description);

  if ($stmt->execute()) {
    // Retrieve the ID of the newly inserted test
    $testId = $stmt->insert_id;
    echo json_encode(['success' => true, 'testId' => $testId]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
  }

  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
