<?php
// Enable strict error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_errors.log');

// Set headers first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Create response function
function jsonResponse($success, $message = '', $errors = [], $code = 200) {
    http_response_code($code);
    die(json_encode([
        'success' => $success,
        'message' => $message,
        'errors' => $errors,
        'timestamp' => date('Y-m-d H:i:s')
    ]));
}

// Verify request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', [], 405);
}

// Get input data
try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?: $_POST;
    
    if (json_last_error() !== JSON_ERROR_NONE && empty($_POST)) {
        throw new Exception('Invalid JSON input');
    }
} catch (Exception $e) {
    jsonResponse(false, 'Input error', [$e->getMessage()], 400);
}

// Validate required fields
$required = ['first-name', 'last-name', 'email', 'message', 'terms'];
$errors = [];

foreach ($required as $field) {
    if (empty($data[$field])) {
        $errors[] = ucfirst(str_replace('-', ' ', $field)).' is required';
    }
}

// Validate email format
if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

// Validate terms
if (empty($data['terms']) || $data['terms'] !== 'on') {
    $errors[] = 'You must accept the terms and conditions';
}

if (!empty($errors)) {
    jsonResponse(false, 'Validation failed', $errors, 422);
}

// Process data
$formData = [
    'first-name' => htmlspecialchars(trim($data['first-name'])),
    'last-name' => htmlspecialchars(trim($data['last-name'])),
    'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
    'telephone' => htmlspecialchars(trim($data['telephone'] ?? '')),
    'message' => htmlspecialchars(trim($data['message'])),
    'terms' => 'Accepted',
    'timestamp' => date('Y-m-d H:i:s')
];

// Save to JSON file
try {
    $file = __DIR__.'/data.json';
    $currentData = [];
    
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $currentData = json_decode($content, true) ?: [];
    }
    
    $currentData[] = $formData;
    
    if (!file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT))) {
        throw new Exception('Failed to save data');
    }
    
    // Send emails (if configured)
    @include __DIR__.'/email-sender.php';
    
    jsonResponse(true, 'Form submitted successfully');
    
} catch (Exception $e) {
    jsonResponse(false, 'Server error', [$e->getMessage()], 500);
}