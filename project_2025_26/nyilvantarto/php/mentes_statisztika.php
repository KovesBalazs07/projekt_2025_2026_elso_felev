<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("localhost", "root", "", "penznyilvantarto");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba"]);
    exit();
}

$bev = $conn->query("SELECT SUM(osszeg) AS osszeg FROM bevetel");
$bev_total = $bev->fetch_assoc()["osszeg"];
if ($bev_total == null) $bev_total = 0;

$kia = $conn->query("SELECT SUM(osszeg) AS osszeg FROM kiadas");
$kia_total = $kia->fetch_assoc()["osszeg"];
if ($kia_total == null) $kia_total = 0;

$havi_bev = $conn->query("
    SELECT MONTH(datum) AS honap, SUM(osszeg) AS osszeg
    FROM bevetel
    GROUP BY MONTH(datum)
    ORDER BY honap
");

$havi_bev_array = [];
while ($sor = $havi_bev->fetch_assoc()) {
    $havi_bev_array[] = $sor;
}

$havi_kia = $conn->query("
    SELECT MONTH(datum) AS honap, SUM(osszeg) AS osszeg
    FROM kiadas
    GROUP BY MONTH(datum)
    ORDER BY honap
");

$havi_kia_array = [];
while ($sor = $havi_kia->fetch_assoc()) {
    $havi_kia_array[] = $sor;
}

$kat = $conn->query("
    SELECT kategoria, SUM(osszeg) AS osszeg
    FROM kiadas
    GROUP BY kategoria
");

$kat_array = [];
while ($sor = $kat->fetch_assoc()) {
    $kat_array[] = $sor;
}

echo json_encode([
    "ossz_bevetel" => $bev_total,
    "ossz_kiadas" => $kia_total,
    "havi_bevetel" => $havi_bev_array,
    "havi_kiadas" => $havi_kia_array,
    "kategoriak" => $kat_array
]);

$conn->close();
?>