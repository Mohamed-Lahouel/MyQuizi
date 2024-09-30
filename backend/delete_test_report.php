<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
include 'db_connect.php'; // Update with your database connection file

$response = array('success' => false, 'message' => '');

try {
  // Get the test ID from POST data
  $data = json_decode(file_get_contents('php://input'), true);
  $testId = $data['testId'];

  if ($testId) {
    // Begin transaction
    $conn->begin_transaction();

    // Delete the test
    $queryTest = "DELETE FROM qcm_tests WHERE testId = ?";
    $stmtTest = $conn->prepare($queryTest);
    $stmtTest->bind_param('i', $testId);

    if ($stmtTest->execute()) {
      // Delete associated reports
      $queryReports = "DELETE FROM reports WHERE testId = ?";
      $stmtReports = $conn->prepare($queryReports);
      $stmtReports->bind_param('i', $testId);

      if ($stmtReports->execute()) {
        // Commit transaction
        $conn->commit();
        $response['success'] = true;
        $response['message'] = 'Test and associated reports deleted successfully.';
      } else {
        // Rollback transaction
        $conn->rollback();
        $response['message'] = 'Failed to delete associated reports.';
      }

      $stmtReports->close();
    } else {
      // Rollback transaction
      $conn->rollback();
      $response['message'] = 'Failed to delete the test.';
    }

    $stmtTest->close();
  } else {
    $response['message'] = 'Test ID not provided.';
  }
} catch (Exception $e) {
  $response['message'] = 'An error occurred: ' . $e->getMessage();
}

// Close the database connection
$conn->close();

// Return the response as JSON
echo json_encode($response);
