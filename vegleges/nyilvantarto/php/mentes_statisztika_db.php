<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("localhost", "root", "", "penzugyinyilvantarto");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["ok" => false, "hiba" => "DB kapcsolat hiba"]);
  exit;
}

$raw = file_get_contents("php://input");
$adat = json_decode($raw, true);

if (!$adat) {
  http_response_code(400);
  echo json_encode(["ok" => false, "hiba" => "Hibás JSON"]);
  exit;
}

function idoszakKezdet($idoszak) {
  $today = new DateTime();

  if ($idoszak === "napi") {
    return $today->format("Y-m-d");
  }

  if ($idoszak === "heti") {
    $dow = (int)$today->format("N"); 
    $today->modify("-" . ($dow - 1) . " day");
    return $today->format("Y-m-d");
  }

  return $today->format("Y-m-01");
}

$sql = "INSERT INTO statisztika (idoszak, kezdet, bevetel, kiadas)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          bevetel = VALUES(bevetel),
          kiadas  = VALUES(kiadas)";

$stmt = $conn->prepare($sql);

$idoszakok = ["napi", "heti", "havi"];

foreach ($idoszakok as $id) {
  $bev = (int)$adat[$id]["bevetel"];
  $kia = (int)$adat[$id]["kiadas"];
  $kezdet = idoszakKezdet($id);

  $stmt->bind_param("ssii", $id, $kezdet, $bev, $kia);
  $stmt->execute();
}

$stmt->close();
$conn->close();

echo json_encode(["ok" => true]);
