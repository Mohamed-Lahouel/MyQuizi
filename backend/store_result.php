<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  exit(0);
}

require_once 'db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (
  isset($data['userId']) && is_numeric($data['userId']) &&
  isset($data['testId']) && is_numeric($data['testId']) &&
  isset($data['score']) && is_numeric($data['score']) &&
  isset($data['answers']) && is_array($data['answers'])
) {
  $userId = (int)$data['userId'];
  $testId = (int)$data['testId'];
  $score = (int)$data['score'];
  $answers = $data['answers'];

  $conn->begin_transaction();

  try {
    $stmt = $conn->prepare("INSERT INTO subscriptions (userId, testId, score) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $userId, $testId, $score);

    if ($stmt->execute()) {
      $subscriptionId = $stmt->insert_id;

      $stmt_answers = $conn->prepare("INSERT INTO user_answers (subscriptionId, questionId, answer) VALUES (?, ?, ?)");

      foreach ($answers as $answer) {
        $questionId = (int)$answer['questionId'];
        $answerText = $conn->real_escape_string($answer['answer']);
        $stmt_answers->bind_param("iis", $subscriptionId, $questionId, $answerText);
        $stmt_answers->execute();
      }

      $conn->commit();
      $response = ['success' => true, 'subscriptionId' => $subscriptionId, 'message' => 'Result and answers saved successfully!'];
    } else {
      throw new Exception('Failed to save result.');
    }

    $stmt->close();
    $stmt_answers->close();
  } catch (Exception $e) {
    $conn->rollback();
    $response = ['success' => false, 'message' => $e->getMessage()];
  }
} else {
  $response = ['success' => false, 'message' => 'Invalid input data.'];
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
