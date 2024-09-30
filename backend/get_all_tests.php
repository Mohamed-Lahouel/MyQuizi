<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0); // End the script execution for preflight requests
}

// Include the database connection
include 'db_connect.php';

// Fetch tests along with the username from the users table
$sql = "SELECT qcm_tests.testId, qcm_tests.title, qcm_tests.description, qcm_tests.published, qcm_tests.code, users.username
        FROM qcm_tests
        JOIN users ON qcm_tests.userId = users.idUser";
$result = $conn->query($sql);

$tests = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $tests[] = $row;
  }
}

echo json_encode($tests);

$conn->close();
