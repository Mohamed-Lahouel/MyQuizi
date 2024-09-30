<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_connect.php';

$subscriptionId = isset($_GET['subscriptionId']) ? intval($_GET['subscriptionId']) : 0;

if ($subscriptionId <= 0) {
  echo json_encode(['success' => false, 'message' => 'Invalid subscription ID']);
  exit();
}

$questions = [];
$userAnswers = [];
$correctAnswers = [];

// Fetch questions and options
$questionsQuery = "SELECT q.id AS questionId, q.text AS questionText, o.id AS optionId, o.text AS optionText, o.is_correct
                   FROM questions q
                   JOIN options o ON q.id = o.question_id
                   WHERE q.test_id = (SELECT test_id FROM subscriptions WHERE id = ?)";
$stmt = $conn->prepare($questionsQuery);
$stmt->bind_param('i', $subscriptionId);
$stmt->execute();
$questionsResult = $stmt->get_result();

while ($row = $questionsResult->fetch_assoc()) {
  $questions[$row['questionId']]['text'] = $row['questionText'];
  $questions[$row['questionId']]['options'][$row['optionId']] = $row['optionText'];
  if ($row['is_correct']) {
    $questions[$row['questionId']]['correctOption'] = $row['optionId'];
  }
}

// Fetch user answers
$answersQuery = "SELECT questionId, answer FROM user_answers WHERE subscriptionId = ?";
$stmt_answers = $conn->prepare($answersQuery);
$stmt_answers->bind_param('i', $subscriptionId);
$stmt_answers->execute();
$answersResult = $stmt_answers->get_result();

while ($answer = $answersResult->fetch_assoc()) {
  $userAnswers[$answer['questionId']] = $answer['answer'];
}

// Fetch score
$scoreQuery = "SELECT score FROM subscriptions WHERE id = ?";
$stmt_score = $conn->prepare($scoreQuery);
$stmt_score->bind_param('i', $subscriptionId);
$stmt_score->execute();
$scoreResult = $stmt_score->get_result();
$scoreData = $scoreResult->fetch_assoc();

$response = [
  'success' => true,
  'score' => $scoreData['score'],
  'questions' => $questions,
  'userAnswers' => $userAnswers,
  'correctAnswers' => array_column($questions, 'correctOption', 'questionId')
];

$stmt->close();
$stmt_answers->close();
$stmt_score->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
