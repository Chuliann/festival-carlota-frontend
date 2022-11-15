<?php

include "cors.php";
include 'includes/funciones.php';
require "vendor/autoload.php";


$json = file_get_contents('php://input');
$data = json_decode($json);
if($data->codigo) {
    $codigo = $data->codigo;
    try {
        $cupon = obtenerCupon($codigo);
        if(!$cupon){
            echo('{"error": "El cupon ingresado no existe, en caso de que sea un error revisar bien el codigo"}');
        } else {
            if($cupon->usado != 1) {
                $cuponUsado = usarCupon($codigo);
                echo json_encode(array("exito" => "funciona"));
            } else {
                echo('{"error": "El cupon ya fue utilizado"}');
            }
        }
    } catch (\Throwable $th) {
        //throw $th;
        echo json_encode($th);
    }
}