<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get input
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// Validate
$errors = [];
$required = ['first-name', 'last-name', 'email', 'message', 'terms'];

foreach ($required as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst(str_replace('-', ' ', $field)) . ' is required';
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

// Process data
$formData = [
    'first-name' => htmlspecialchars(trim($input['first-name'])),
    'last-name' => htmlspecialchars(trim($input['last-name'])),
    'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
    'telephone' => htmlspecialchars(trim($input['telephone'] ?? '')),
    'message' => htmlspecialchars(trim($input['message'])),
    'timestamp' => date('Y-m-d H:i:s')
];

// Save to JSON
try {
    $file = __DIR__ . '/data.json';
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $data[] = $formData;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    
    echo json_encode([
        'success' => true,
        'message' => 'Form submitted successfully!'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save data']);
}