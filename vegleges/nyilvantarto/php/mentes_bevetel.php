<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("localhost", "root", "", "penzugyinyilvantarto");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
  exit();
}

$datum = $_POST["datum"] ?? "";
$kategoria = $_POST["kategoria"] ?? "";
$osszeg = $_POST["osszeg"] ?? "";
$megjegyzes = $_POST["megjegyzes"] ?? "";
$fizmod = $_POST["fizmod"] ?? "";

$sql = "INSERT INTO bevetel (datum, kategoria, osszeg, megjegyzes, fizetesi_mod)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssiss", $datum, $kategoria, $osszeg, $megjegyzes, $fizmod);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Bevétel sikeresen mentve"], JSON_UNESCAPED_UNICODE);
} else {
  echo json_encode(["success" => false, "message" => "Mentési hiba: " . $stmt->error], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>
