<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



$apiToken = '';


$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = dirname(__DIR__) . '/smartminions/uploads/minion_images/';


if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}


if ($method === 'POST') {

    $modelName = 'imagen-4.0-generate-001';
    $aiGenerateUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:predict";

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!isset($data['prompt']) || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos (prompt o id)."]);
        exit;
    }

    $prompt = $data['prompt'];
    $minionId = $data['id'];
    $fileName = $minionId . '.jpg';
    $filePath = $uploadDir . $fileName;


    $postData = json_encode([
        "instances" => [
            [
                "prompt" => $prompt
            ]
        ],
        "parameters" => [
            "sampleCount" => 1,
            "aspectRatio" => "1:1",
            "outputOptions" => [
                "mimeType" => "image/jpeg"
            ]
        ]
    ]);

    $ch = curl_init();
    // Ponemos la key en la URL
    curl_setopt($ch, CURLOPT_URL, $aiGenerateUrl . "?key=" . $apiToken);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    // AÑADIDO: Cabeceras extra de autenticación por si acaso
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "x-goog-api-key: {$apiToken}" // A veces Google prefiere esto
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

    // AÑADIDO: Ignorar SSL temporalmente para descartar errores de certificados locales
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $aiResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        http_response_code(500);
        echo json_encode(["error" => "Error de conexión Curl: " . curl_error($ch)]);
        exit;
    }
    curl_close($ch);

    // Intentamos decodificar
    $aiData = json_decode($aiResponse, true);



    if ($aiData === null) {
        http_response_code(500);
        echo json_encode([
            "error" => "La API no devolvió un JSON válido.",
            "http_code" => $httpCode,
            "raw_response" => $aiResponse // <--- ESTO NOS DIRÁ EL ERROR REAL
        ]);
        exit;
    }

    // Manejo de errores de la API (si devuelve JSON de error)
    if ($httpCode !== 200 || isset($aiData['error'])) {
        http_response_code($httpCode !== 200 ? $httpCode : 400);
        echo json_encode([
            "error" => "Error de Google API",
            "details" => $aiData
        ]);
        exit;
    }

    // Buscar la imagen en la respuesta
    $base64Image = null;

    if (isset($aiData['predictions'][0]['bytesBase64Encoded'])) {
        $base64Image = $aiData['predictions'][0]['bytesBase64Encoded'];
    } elseif (isset($aiData['predictions'][0]['structValue']['fields']['bytesBase64Encoded']['stringValue'])) {
        $base64Image = $aiData['predictions'][0]['structValue']['fields']['bytesBase64Encoded']['stringValue'];
    }

    if ($base64Image) {
        $imageData = base64_decode($base64Image);

        if (file_put_contents($filePath, $imageData)) {
            $publicUrl = '/uploads/minion_images/' . $fileName;
            echo json_encode(["success" => true, "url" => $publicUrl]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo guardar la imagen en disco."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Estructura desconocida.", "debug" => $aiData]);
    }
    exit;
}

// ----------------------------------------------------
// POR CORS GUARDO LOS DATOS PARA USARLOS
// ----------------------------------------------------
if ($method === 'GET') {
    $baseUrl = "https://minion.globalsmartiot.es";
    $path = isset($_GET['path']) ? $_GET['path'] : '';
    $queryString = $_SERVER['QUERY_STRING'];
    $queryString = preg_replace('/path=[^&]*&?/', '', $queryString);
    $url = $baseUrl . "/" . $path . ($queryString ? "?" . $queryString : "");

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($httpCode);
    echo $response;
}