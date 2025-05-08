<?php
header('Content-Type: application/json');

// Get form data
$formData = [
    'first-name' => $_POST['first-name'] ?? '',
    'last-name' => $_POST['last-name'] ?? '',
    'email' => $_POST['email'] ?? '',
    'telephone' => $_POST['telephone'] ?? '',
    'message' => $_POST['message'] ?? '',
    'terms' => isset($_POST['terms']) ? 'Accepted' : 'Not Accepted',
    'timestamp' => date('Y-m-d H:i:s')
];

// Validate required fields
$errors = [];
if (empty($formData['first-name'])) $errors[] = 'First Name is required';
if (empty($formData['last-name'])) $errors[] = 'Last Name is required';
if (empty($formData['email'])) $errors[] = 'Email is required';
if (!filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email format';
if (empty($formData['message'])) $errors[] = 'Message is required';
if ($formData['terms'] === 'Not Accepted') $errors[] = 'You must accept the terms and conditions';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Save to JSON file
$file = './data.json';
$currentData = [];
if (file_exists($file)) {
    $currentData = json_decode(file_get_contents($file), true);
    if ($currentData === null) {
        $currentData = [];
    }
}
$currentData[] = $formData;
file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));

// Send emails
require './email-sender.php';

echo json_encode(['success' => true]);
?>