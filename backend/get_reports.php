<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
include 'db_connect.php'; // Update with your database connection file

$response = array('success' => false, 'data' => [], 'message' => '');

try {
  // Query to fetch all reports
  $query = "SELECT r.reportId, r.testId, r.reason, r.description, t.title AS testTitle, u.username
              FROM reports r
              JOIN qcm_tests t ON r.testId = t.testId
              JOIN users u ON r.userId = u.idUser";

  $result = $conn->query($query);

  if ($result->num_rows > 0) {
    $reports = array();

    while ($row = $result->fetch_assoc()) {
      $reports[] = $row;
    }

    $response['success'] = true;
    $response['data'] = $reports;
  } else {
    $response['message'] = 'No reports found.';
  }
} catch (Exception $e) {
  $response['message'] = 'An error occurred: ' . $e->getMessage();
}

// Close the database connection
$conn->close();

// Return the response as JSON
echo json_encode($response);
