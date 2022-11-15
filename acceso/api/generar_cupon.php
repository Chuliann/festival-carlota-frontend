<?php

require 'vendor/autoload.php';  
require 'includes/funciones.php';
include "./cors.php";
header("Access-Control-Allow-Headers: *");

use Ramsey\Uuid\Uuid;


$json = file_get_contents('php://input');
$data = json_decode($json);
if($data->pago) {
    $uuid = Uuid::uuid4();
    $data->codigo = $uuid;

    try {
        $resultado = crearCupon($data);
        echo json_encode($uuid);
    } catch (\Throwable $th) {
        echo json_encode($th);
    }

}
