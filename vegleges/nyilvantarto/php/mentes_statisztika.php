<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("localhost", "root", "", "penzugyinyilvantarto");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
  echo json_encode(["hiba" => $conn->connect_error]);
  exit;
}

$datumMezoBevetel = "datum";
$datumMezoKiadas  = "datum";

function osszeg($conn, $tabla, $datumMezo, $feltetel) {
  $sql = "SELECT COALESCE(SUM(osszeg),0) AS ossz FROM $tabla WHERE $feltetel";
  $res = $conn->query($sql);
  $row = $res->fetch_assoc();
  return (int)$row["ossz"];
}

$bevDb = (int)$conn->query("SELECT COUNT(*) AS db FROM bevetel")->fetch_assoc()["db"];
$kiaDb = (int)$conn->query("SELECT COUNT(*) AS db FROM kiadas")->fetch_assoc()["db"];

$bevLast = $conn->query("SELECT osszeg, $datumMezoBevetel AS datum FROM bevetel ORDER BY id DESC LIMIT 1");
$kiaLast = $conn->query("SELECT osszeg, $datumMezoKiadas  AS datum FROM kiadas  ORDER BY id DESC LIMIT 1");

$bevLastRow = $bevLast ? $bevLast->fetch_assoc() : null;
$kiaLastRow = $kiaLast ? $kiaLast->fetch_assoc() : null;

$napi = "DATE($datumMezoBevetel) = CURDATE()";
$heti = "YEARWEEK($datumMezoBevetel,1) = YEARWEEK(CURDATE(),1)";
$havi = "MONTH($datumMezoBevetel)=MONTH(CURDATE()) AND YEAR($datumMezoBevetel)=YEAR(CURDATE())";

$napiK = "DATE($datumMezoKiadas) = CURDATE()";
$hetiK = "YEARWEEK($datumMezoKiadas,1) = YEARWEEK(CURDATE(),1)";
$haviK = "MONTH($datumMezoKiadas)=MONTH(CURDATE()) AND YEAR($datumMezoKiadas)=YEAR(CURDATE())";

echo json_encode([
  "debug" => [
    "bevetel_db" => $bevDb,
    "kiadas_db" => $kiaDb,
    "bevetel_last" => $bevLastRow,
    "kiadas_last" => $kiaLastRow
  ],
  "napi" => [
    "bevetel" => osszeg($conn, "bevetel", $datumMezoBevetel, $napi),
    "kiadas"  => osszeg($conn, "kiadas",  $datumMezoKiadas,  $napiK)
  ],
  "heti" => [
    "bevetel" => osszeg($conn, "bevetel", $datumMezoBevetel, $heti),
    "kiadas"  => osszeg($conn, "kiadas",  $datumMezoKiadas,  $hetiK)
  ],
  "havi" => [
    "bevetel" => osszeg($conn, "bevetel", $datumMezoBevetel, $havi),
    "kiadas"  => osszeg($conn, "kiadas",  $datumMezoKiadas,  $haviK)
  ]
], JSON_UNESCAPED_UNICODE);

$conn->close();
