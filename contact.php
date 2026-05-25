<?php
/**
 * OUTPOST SECURITY SERVICES — CONTACT FORM HANDLER
 * =================================================
 * Place this file on your PHP-capable server.
 * Update the $to_email variable to your company email.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

// Configuration
$to_email     = 'info@outpostsecurity.com'; // Change this
$company_name = 'Outpost Security Services';
$site_url     = 'https://www.outpostsecurity.com';

// Sanitize & validate inputs
function sanitize($val) {
    return htmlspecialchars(trim(stripslashes($val ?? '')), ENT_QUOTES, 'UTF-8');
}

$form_type = sanitize($_POST['form_type'] ?? 'contact');

if ($form_type === 'contact') {
    $name    = sanitize($_POST['name'] ?? '');
    $email   = sanitize($_POST['email'] ?? '');
    $phone   = sanitize($_POST['phone'] ?? '');
    $service = sanitize($_POST['service'] ?? '');
    $message = sanitize($_POST['message'] ?? '');

    // Validation
    $errors = [];
    if (empty($name))                    $errors[] = 'Name is required.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
    if (empty($message))                 $errors[] = 'Message is required.';

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit();
    }

    $subject = "New Contact Request — $name | $company_name";
    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;'>
  <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;'>
    <div style='background:#111111;padding:28px 32px;'>
      <h1 style='color:#C8A24D;font-size:1.6rem;margin:0;letter-spacing:3px;font-family:Georgia,serif;'>OUTPOST SECURITY</h1>
      <p style='color:#BFC3C7;margin:6px 0 0;font-size:0.85rem;letter-spacing:2px;'>NEW CONTACT REQUEST</p>
    </div>
    <div style='padding:32px;'>
      <table style='width:100%;border-collapse:collapse;'>
        <tr><td style='padding:10px 0;border-bottom:1px solid #eee;'><strong style='color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:1px;'>Name</strong></td><td style='padding:10px 0;border-bottom:1px solid #eee;color:#111;'>$name</td></tr>
        <tr><td style='padding:10px 0;border-bottom:1px solid #eee;'><strong style='color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:1px;'>Email</strong></td><td style='padding:10px 0;border-bottom:1px solid #eee;color:#111;'>$email</td></tr>
        <tr><td style='padding:10px 0;border-bottom:1px solid #eee;'><strong style='color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:1px;'>Phone</strong></td><td style='padding:10px 0;border-bottom:1px solid #eee;color:#111;'>$phone</td></tr>
        <tr><td style='padding:10px 0;border-bottom:1px solid #eee;'><strong style='color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:1px;'>Service</strong></td><td style='padding:10px 0;border-bottom:1px solid #eee;color:#111;'>$service</td></tr>
        <tr><td style='padding:10px 0;' colspan='2'><strong style='color:#555;font-size:0.82rem;text-transform:uppercase;letter-spacing:1px;'>Message</strong><br><div style='margin-top:10px;color:#333;line-height:1.7;'>$message</div></td></tr>
      </table>
    </div>
    <div style='background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;'>
      <p style='margin:0;font-size:0.8rem;color:#888;'>Submitted from $site_url &bull; " . date('F j, Y \a\t g:i A') . "</p>
    </div>
  </div>
</body>
</html>";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $company_name <noreply@outpostsecurity.com>\r\n";
    $headers .= "Reply-To: $email\r\n";

    $sent = mail($to_email, $subject, $body, $headers);

    // Send auto-reply
    $auto_subject = "We Received Your Request — $company_name";
    $auto_body = "
<!DOCTYPE html>
<html>
<body style='font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;'>
  <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;'>
    <div style='background:#111111;padding:28px 32px;'>
      <h1 style='color:#C8A24D;font-size:1.6rem;margin:0;letter-spacing:3px;font-family:Georgia,serif;'>OUTPOST SECURITY</h1>
    </div>
    <div style='padding:32px;'>
      <h2 style='color:#111;font-size:1.2rem;margin-bottom:16px;'>Thank You, $name</h2>
      <p style='color:#555;line-height:1.8;'>We have received your request and a member of our team will contact you within <strong>2 business hours</strong>.</p>
      <p style='color:#555;line-height:1.8;'>For urgent security matters, please call us directly at <strong>(310) 555-0190</strong>.</p>
      <div style='margin:28px 0;padding:20px;background:#f9f9f9;border-left:3px solid #C8A24D;border-radius:0 4px 4px 0;'>
        <p style='margin:0;font-size:0.9rem;color:#333;'>Reference: <strong>" . strtoupper(substr(md5($email . time()), 0, 8)) . "</strong></p>
      </div>
    </div>
    <div style='background:#111111;padding:20px 32px;'>
      <p style='margin:0;font-size:0.8rem;color:#888;'>$company_name &bull; Southern California &bull; Licensed &amp; Insured</p>
    </div>
  </div>
</body>
</html>";

    mail($email, $auto_subject, $auto_body, "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: $company_name <noreply@outpostsecurity.com>\r\n");

    echo json_encode([
        'success' => $sent,
        'message' => $sent ? 'Your message has been sent successfully.' : 'Failed to send. Please try again.'
    ]);

} elseif ($form_type === 'quote') {
    $name     = sanitize($_POST['name'] ?? '');
    $email    = sanitize($_POST['email'] ?? '');
    $phone    = sanitize($_POST['phone'] ?? '');
    $service  = sanitize($_POST['service'] ?? '');
    $location = sanitize($_POST['location'] ?? '');
    $property = sanitize($_POST['property_type'] ?? '');
    $schedule = sanitize($_POST['schedule'] ?? '');

    $subject = "Quote Request — $service | $name";
    $body = "<html><body style='font-family:Arial;padding:20px;'>
        <h2 style='color:#C8A24D;'>New Quote Request</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Service:</strong> $service</p>
        <p><strong>Location:</strong> $location</p>
        <p><strong>Property Type:</strong> $property</p>
        <p><strong>Preferred Schedule:</strong> $schedule</p>
        <p style='color:#888;font-size:0.8rem;'>" . date('F j, Y g:i A') . "</p>
    </body></html>";

    $headers = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: noreply@outpostsecurity.com\r\nReply-To: $email\r\n";
    $sent = mail($to_email, $subject, $body, $headers);

    echo json_encode(['success' => $sent, 'message' => $sent ? 'Quote request sent!' : 'Failed to send.']);

} elseif ($form_type === 'application') {
    $first_name  = sanitize($_POST['first_name'] ?? '');
    $last_name   = sanitize($_POST['last_name'] ?? '');
    $email       = sanitize($_POST['email'] ?? '');
    $phone       = sanitize($_POST['phone'] ?? '');
    $position    = sanitize($_POST['position'] ?? '');
    $experience  = sanitize($_POST['experience'] ?? '');
    $licensed    = sanitize($_POST['licensed'] ?? '');
    $cover       = sanitize($_POST['cover_letter'] ?? '');

    $name    = "$first_name $last_name";
    $subject = "Job Application — $position | $name";
    $body = "<html><body style='font-family:Arial;padding:20px;'>
        <h2 style='color:#C8A24D;'>New Job Application</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Position:</strong> $position</p>
        <p><strong>Years of Experience:</strong> $experience</p>
        <p><strong>Guard Card / Licensed:</strong> $licensed</p>
        <p><strong>Cover Letter:</strong><br>$cover</p>
        <p style='color:#888;font-size:0.8rem;'>" . date('F j, Y g:i A') . "</p>
    </body></html>";

    $headers = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: careers@outpostsecurity.com\r\nReply-To: $email\r\n";
    $sent = mail($to_email, $subject, $body, $headers);

    echo json_encode(['success' => $sent, 'message' => $sent ? 'Application received!' : 'Failed to submit.']);

} else {
    echo json_encode(['success' => false, 'message' => 'Unknown form type.']);
}
?>