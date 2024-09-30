<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST');

include 'db_connect.php'; 

$sql = "
  SELECT rr.idRequest, u.username, rr.status
  FROM role_requests rr
  JOIN users u ON rr.idUser = u.idUser
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(['success' => false, 'message' => 'Database query failed: ' . $conn->error]); // Include error message
    $conn->close();
    exit;
}

if ($result->num_rows > 0) {
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    echo json_encode($requests); 
} else {
    echo json_encode([]); 
}

$conn->close();
