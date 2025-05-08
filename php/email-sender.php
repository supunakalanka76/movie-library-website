<?php
// Auto response to user
$to_user = $formData['email'];
$subject_user = "Thank you for contacting Movie Library";
$message_user = "Dear ".$formData['first-name'].",\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nYour message:\n".$formData['message']."\n\nBest regards,\nThe Movie Library Team";
$headers_user = "From: noreply@movielibrary.com";

mail($to_user, $subject_user, $message_user, $headers_user);

// Notification to admin
$to_admin = "dumidu.kodithuwakku@ebeyonds.com, prabhath.senadheera@ebeyonds.com";
$subject_admin = "New Contact Form Submission - Movie Library";
$message_admin = "New contact form submission received:\n\n".
                "Name: ".$formData['first-name']." ".$formData['last-name']."\n".
                "Email: ".$formData['email']."\n".
                "Phone: ".$formData['telephone']."\n".
                "Message: ".$formData['message']."\n\n".
                "Submitted at: ".$formData['timestamp']."\n".
                "Terms Accepted: ".$formData['terms'];
$headers_admin = "From: noreply@movielibrary.com";

mail($to_admin, $subject_admin, $message_admin, $headers_admin);
?>