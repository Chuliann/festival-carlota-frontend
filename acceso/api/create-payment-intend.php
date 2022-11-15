<?php
include("./cors.php");

require 'vendor/autoload.php';

header('Content-Type: application/json');
$json = file_get_contents('php://input');
$data = json_decode($json);
$amount = filter_var($data->amount, FILTER_VALIDATE_FLOAT);

/* if(isset($data->mail)) {
     Enviar mail 
    $email = filter_var($data->mail, FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
         No es un correo valido 
    }
} */

$stripe = new \Stripe\StripeClient('sk_test_51Lk8lnKsbDW2PTHgGLt5AtT0Iv7zJGyaR3WuZt8Jz5jiVDPS0Ixbh1uNSnCgPXc3oyFqwlKVie5N8QB7e65P0sgn00bRHNhBZr');
if($amount) {
    try {
        $intend = $stripe->paymentIntents->create(
            [
            'amount' => $amount,
            'currency' => 'mxn',
            'automatic_payment_methods' => ['enabled' => true],
            ]
        );
        echo json_encode(array("secret" => $intend->client_secret));
    } catch (\Stripe\Exception\ApiErrorException $e) {
        echo json_encode($e->getError()->message);
        exit;
    } catch (Exception $e) {
        echo json_encode($e);
        exit;
    }

}