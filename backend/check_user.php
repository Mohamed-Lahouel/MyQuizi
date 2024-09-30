<?php

// Database connection details
$host = 'localhost';
$db = 'qcm';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$response = ['success' => false, 'message' => '', 'idUser' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  $email = $data['email'];

  // Check if the email exists in the database
  $stmt = $conn->prepare("SELECT idUser FROM users WHERE email = ?");
  $stmt->bind_param('s', $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    // Email exists in the database, fetch the idUser
    $stmt->bind_result($idUser);
    $stmt->fetch();
    $response['success'] = true;
    $response['message'] = 'User exists.';
    $response['idUser'] = $idUser;
  } else {
    // Email does not exist in the database
    $response['message'] = 'User does not exist.';
  }

  $stmt->close();
} else {
  $response['message'] = 'Invalid request method.';
}

$conn->close();

echo json_encode($response);
