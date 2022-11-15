<?php

include("./cors.php");

require "includes/funciones.php";

header('Content-Type: application/json');
$json = file_get_contents('php://input');
$data = json_decode($json);

if(isset($data->codigo)) {
    try {
        $resultado = compararCodigo($data->codigo);
        if(isset($resultado->codigo)) {
            echo json_encode(array("acceso" => true));
        } else {
            echo json_encode(array("acceso" => false));
        }
        
    } catch (\Throwable $th) {
        echo json_encode(array("error" => $th));
    }
    
}