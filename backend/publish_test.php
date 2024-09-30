<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->testId)) {
  $testId = $data->testId;

  // Generate a unique code for the test
  $code = bin2hex(random_bytes(5));

  $query = "UPDATE qcm_tests SET published = 1, code = ? WHERE testId = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("si", $code, $testId);

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Test published successfully.", "code" => $code]);
  } else {
    echo json_encode(["success" => false, "message" => "Failed to publish test."]);
  }

  $stmt->close();
} else {
  echo json_encode(["success" => false, "message" => "Invalid input."]);
}

$conn->close();
