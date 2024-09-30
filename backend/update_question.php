<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT'); // Allow PUT method
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit();
}

require 'db_connect.php'; // Ensure your database connection details are correct

// Retrieve PUT data
$data = json_decode(file_get_contents('php://input'), true);

$questionId = isset($data['questionId']) ? intval($data['questionId']) : 0;
$text = isset($data['text']) ? $data['text'] : '';
$option1 = isset($data['option1']) ? $data['option1'] : '';
$option2 = isset($data['option2']) ? $data['option2'] : '';
$option3 = isset($data['option3']) ? $data['option3'] : '';
$option4 = isset($data['option4']) ? $data['option4'] : '';
$correctOption = isset($data['correctOption']) ? $data['correctOption'] : '';

// Prepare response data
$response = [];

// Validate the input
if (empty($questionId) || empty($text) || empty($option1) || empty($option2) || empty($option3) || empty($option4) || empty($correctOption)) {
  $response['success'] = false;
  $response['message'] = 'Invalid input';
  echo json_encode($response);
  exit();
}

// Prepare and execute the update statement
$stmt = $conn->prepare('UPDATE questions SET text = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, correctOption = ? WHERE questionId = ?');
$stmt->bind_param('ssssssi', $text, $option1, $option2, $option3, $option4, $correctOption, $questionId);

if ($stmt->execute()) {
  $response['success'] = true;
  $response['message'] = 'Question updated successfully';
} else {
  $response['success'] = false;
  $response['message'] = 'An error occurred while updating the question';
}

$stmt->close();
$conn->close();

// Output the response
echo json_encode($response);
