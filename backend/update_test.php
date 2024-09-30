<?php
// Include the database connection file
include 'db_connect.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Allow cross-origin requests (optional)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get data from request
$testId = $_POST['testId'] ?? '';  // Updated key names
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';

// Prepare response data
$response = [
  'receivedData' => [
    'testId' => $testId,
    'title' => $title,
    'description' => $description
  ]
];

// Validate the input
if (empty($testId) || empty($title) || empty($description)) {
  $response['success'] = false;
  $response['message'] = 'Invalid input';
  echo json_encode($response);
  exit();
}

// Prepare and execute the update statement
$stmt = $conn->prepare('UPDATE qcm_tests SET title = ?, description = ? WHERE testId = ?');
$stmt->bind_param('ssi', $title, $description, $testId);

if ($stmt->execute()) {
  $response['success'] = true;
  $response['message'] = 'Test updated successfully';
} else {
  $response['success'] = false;
  $response['message'] = 'An error occurred while updating the test';
}

$stmt->close();
$conn->close();

// Output the response
echo json_encode($response);
