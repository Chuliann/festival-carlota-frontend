<?php

function crearCupon($cupon) 
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("INSERT INTO cupones(codigo) VALUES (?)");
    return $sentencia->execute([$cupon->codigo]);
}

function usarCupon($codigo)
{  
    $bd = obtenerConexion();
    /* $date = date('Y-m-d H:m:s', time()); */
    $date = time();
    $sentencia = $bd->prepare("UPDATE cupones SET tiempo = ?, usado = ? WHERE codigo = ?");
    return $sentencia->execute([$date, 1, $codigo]);
}

function obtenerCupon($codigo)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("SELECT * FROM cupones WHERE codigo = ?");
    $sentencia->execute([$codigo]);
    return $sentencia->fetchObject();
}

function compararCodigo($codigo)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("SELECT * FROM codigo WHERE codigo = ?");
    $sentencia->execute([$codigo]);
    return $sentencia->fetchObject();
}





function obtenerVideojuegoPorId($id)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("SELECT id, nombre, precio, calificacion FROM videojuegos WHERE id = ?");
    $sentencia->execute([$id]);
    return $sentencia->fetchObject();
}

function obtenerCupones()
{
    $bd = obtenerConexion();
    $sentencia = $bd->query("SELECT * FROM cupones");
    return $sentencia->fetchAll();
}

function guardarVideojuego($videojuego)
{
    $bd = obtenerConexion();
    $sentencia = $bd->prepare("INSERT INTO videojuegos(nombre, precio, calificacion) VALUES (?, ?, ?)");
    return $sentencia->execute([$videojuego->nombre, $videojuego->precio, $videojuego->calificacion]);
}

function obtenerVariableDelEntorno($key)
{
    if (defined("_ENV_CACHE")) {
        $vars = _ENV_CACHE;
    } else {
        $file = "env.php";
        if (!file_exists($file)) {
            throw new Exception("El archivo de las variables de entorno ($file) no existe. Favor de crearlo");
        }
        $vars = parse_ini_file($file);
        define("_ENV_CACHE", $vars);
    }
    if (isset($vars[$key])) {
        return $vars[$key];
    } else {
        throw new Exception("La clave especificada (" . $key . ") no existe en el archivo de las variables de entorno");
    }
}
function obtenerConexion()
{
    $password = obtenerVariableDelEntorno("MYSQL_PASSWORD");
    $user = obtenerVariableDelEntorno("MYSQL_USER");
    $dbName = obtenerVariableDelEntorno("MYSQL_DATABASE_NAME");
    $database = new PDO('mysql:host=localhost;dbname=' . $dbName, $user, $password);
    $database->query("set names utf8;");
    $database->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    return $database;
}

function debuguear($var, $si = false) {
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
    if($si) {
        exit;
    }
}