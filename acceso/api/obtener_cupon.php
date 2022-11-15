<?php
include_once "cors.php";
include 'includes/funciones.php';

$json = file_get_contents('php://input');
$data = json_decode($json);
if(isset($data->codigo)) {
    $cupon = obtenerCupon($data->codigo);
    $fecha = $cupon->tiempo;
    $timestamp2 = time();
    echo json_encode(array("diferencia" => ($timestamp2 - $fecha) / 3600));
    exit;
}
echo json_encode(array("diferencia" => 24));


