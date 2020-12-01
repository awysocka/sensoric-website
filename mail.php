---
permalink: /kontakt/mail.php
---

<?php

// if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
error_reporting(E_ALL & ~E_NOTICE);


/*
 *  CONFIGURATION
 */

// an email address that will be in the From field of the email.
$from = 'Formularz kontaktowy <kontakt@sensoric.eu>';

// an email address that will receive the email with the output of the form
$sendTo = 'Sensoric <kontakt@sensoric.eu>';

// subject of the email
$subjectPrefix = 'Nowa wiadomość od ';

// prefix of the email body
$emailBodyPrefix = 'Nowa wiadomość:';

// subject of the confirmation email
$confirmationSubject = 'Potwierdzenie wysłania wiadomości';

// prefix of the confirmation email body
$confirmationEmailBodyPrefix = "Dziękujemy za kontakt. Otrzymaliśmy Twoją wiadomość i postaramy się odpowiedzieć tak szybko jak to będzie możliwe.\n"
                              ."\n"
                              ."Przesłane przez Ciebie informacje:";

// form field names and their translations.
// array variable name => Text to appear in the email
$fields = [
    'name' => 'Imię i nazwisko',
    'email' => 'Adres email',
    'phoneNumber' => 'Numer telefonu',
    'agreement' => 'Zgoda RODO',
    'message' => 'Wiadomość'
];

$agreementWasGiven = 'udzielono';

$ipAddressLabel = "Adres IP";

$userAgentLabel = "Przeglądarka";

// message that will be displayed when everything is OK :)
$okMessage = 'Wiadomość została wysłana.';

// If something goes wrong while sending the email, we will display this message.
$couldNotSendEmailErrorMessage = 'W trakcie wysyłania wiadomości wystąpił błąd. Spróbuj ponownie później.';

$invalidRequestMethodValidationMessage = 'Dozwolone tylko zapytania typu POST';

$invalidContentTypeValidationMessage = 'Obsługiwane content-type to application/json i application/x-www-form-urlencoded';

$emptyFormValidationMessage = 'Formularz jest pusty';

$formField = 'Pole';

$canNotBeEmptyValidationMessage = "nie może być puste";

$mustBeValidEmailAddressValidationMessage = "musi zawierać poprawny adres email";

$mustBeTrueValidationMessage = "musi zawierać wartość true";


/*
 *  IMPLEMENTATION
 */

/**
 * Request validation exception
 */
class ValidationException extends Exception {}

/**
 * Validates the request
 *
 * @throws ValidationException if validation fail
 */
function validateRequest() {
    global $fields,
           $invalidRequestMethodValidationMessage,
           $invalidContentTypeValidationMessage,
           $emptyFormValidationMessage,
           $formField,
           $canNotBeEmptyValidationMessage,
           $mustBeValidEmailAddressValidationMessage,
           $mustBeTrueValidationMessage;

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new ValidationException($invalidRequestMethodValidationMessage);
    }

    if (strcmp($_SERVER["CONTENT_TYPE"], 'application/json') !== 0 and
        strcmp($_SERVER["CONTENT_TYPE"], 'application/x-www-form-urlencoded') !== 0) {
        throw new ValidationException($invalidContentTypeValidationMessage);
    }

    if (count($_POST) === 0) {
        throw new ValidationException($emptyFormValidationMessage);
    }

    foreach ($fields as $key => $label) {
        // trim value
        $value = $_POST[$key];
        $trimmed = trim($value);

        // value not empty validation
        if (empty($trimmed) && strcmp($key, 'phoneNumber') !== 0) {
            throw new ValidationException("$formField $label $canNotBeEmptyValidationMessage");
        }

        // email validation
        if(strcmp($key, 'email') === 0) {
            $trimmed = filter_var($trimmed, FILTER_SANITIZE_EMAIL);
            // check if value is null
            if (empty($trimmed)) {
                throw new ValidationException("$formField $label $mustBeValidEmailAddressValidationMessage");
            }
        }

        // agreement validation
        if(strcmp($key, 'agreement') === 0) {
            $trimmed = boolval($value);
            // check if value is true
            if (!$trimmed) {
                throw new ValidationException("$formField $label $mustBeTrueValidationMessage");
            }
        }
    }
}

/**
 * Prepares the email body
 *
 * @param $bodyPrefix string message visible before contact form values
 * @param $withAdditionalDetails boolean should include ip address and other details
 * @return string
 */
function prepareEmailBody($bodyPrefix, $withAdditionalDetails) {
    global $fields,
           $agreementWasGiven,
           $ipAddressLabel,
           $userAgentLabel;

    $emailText = "$bodyPrefix\n";
    $emailText .= "\n";

    foreach ($fields as $key => $label) {
        // trim value
        $trimmed = trim($_POST[$key]);

        if(strcmp($key, 'email') === 0) {
            $trimmed = filter_var($trimmed, FILTER_SANITIZE_EMAIL);
        }

        if(strcmp($key, 'agreement') === 0) {
            $trimmed = $agreementWasGiven;
        }

        // add new line before message
        if(strcmp($key, 'message') === 0) {
            $trimmed = "\n\n$trimmed";
        }

        $emailText .= "$label: $trimmed\n";
    }

    $emailText .= "\n";

    if ($withAdditionalDetails) {
        $emailText .= "-----------------------------\n";
        $emailText .= "$ipAddressLabel: {$_SERVER['REMOTE_ADDR']}\n";
        $emailText .= "{$userAgentLabel}: {$_SERVER['HTTP_USER_AGENT']}\n";
    }

    return $emailText;
}

try {
    // decode JSON
    if (strcmp($_SERVER["CONTENT_TYPE"], 'application/json') === 0) {
        $_POST = json_decode(file_get_contents('php://input'), true);
    }

    validateRequest();

    // make given email address safe
    $emailAddressFromContactForm = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);

    // sending contact form email

    $emailText = prepareEmailBody($emailBodyPrefix, true);
    $headers = [
        'Content-Type: text/plain; charset="UTF-8";',
        "From: $from",
        "Reply-To: $emailAddressFromContactForm",
        "Return-Path: $from"
    ];

    $success = mail($sendTo, "$subjectPrefix$emailAddressFromContactForm", $emailText, implode("\n", $headers));

    if(!$success) {
        throw new Exception($couldNotSendEmailErrorMessage);
    }

    // sending confirmation email

    $emailText = prepareEmailBody($confirmationEmailBodyPrefix, false);
    $headers = [
        'Content-Type: text/plain; charset="UTF-8";',
        "From: $from",
        "Reply-To: $from",
        "Return-Path: $from"
    ];

    $success = mail($emailAddressFromContactForm, $confirmationSubject, $emailText, implode("\n", $headers));

    if(!$success) {
        throw new Exception($couldNotSendEmailErrorMessage);
    }

    // if everything succeeded

    $responseArray = ['type' => 'success', 'message' => $okMessage];
    http_response_code(200);
} catch (ValidationException $e) {
    $responseArray = ['type' => 'error', 'message' => $e->getMessage()];
    http_response_code(400);
} catch (Exception $e) {
    $responseArray = ['type' => 'error', 'message' => $e->getMessage()];
    http_response_code(500);
}

// if requested by AJAX request return JSON response
if ($_SERVER['HTTP_ACCEPT'] === 'application/json') {
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode($responseArray);
} else {
	header('Content-Type: text/plain; charset=utf-8');

    echo $responseArray['message'];
}
