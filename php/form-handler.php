<?php
// Enable CORS and set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    $input = $_POST;
}

// Process and validate data
$errors = [];
$fields = ['first-name', 'last-name', 'email', 'message', 'terms'];

foreach ($fields as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst(str_replace('-', ' ', $field)).' is required';
    }
}

if (!filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (($input['terms'] ?? '') !== 'on') {
    $errors[] = 'You must accept the terms';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// If we get here, data is valid
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Form submitted successfully'
]);