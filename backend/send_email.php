<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include the PHPMailer files
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection details
$host = 'localhost';
$db = 'qcm';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  $email = $data['email'];
  $idUser = $data['idUser'];
  $verificationCode = $data['verificationCode'];

  // Send email
  $mail = new PHPMailer(true);

  try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mohamed.lahouel@esprit.tn';
    $mail->Password = 'whcigzrlpjmfdimm';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Recipients
    $mail->setFrom('mohamed.lahouel@esprit.tn', 'MyQuizi');
    $mail->addAddress($email);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Password Reset Verification Code';
    $mail->Body = "<p>Your verification code is: <b>$verificationCode</b></p>";
    $mail->AltBody = "Your verification code is: $verificationCode";

    $mail->send();
    $response['success'] = true;
    $response['message'] = 'Email has been sent with the verification code.';
  } catch (Exception $e) {
    $response['message'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }
} else {
  $response['message'] = 'Invalid request method.';
}

$conn->close();

echo json_encode($response);
