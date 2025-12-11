<?php
header("Content-Type: application/json; charset=utf-8");

// Kapcsolódás az adatbázishoz
$conn = new mysqli("localhost", "root", "", "penznyilvantarto");

if ($conn->connect_error) {
    echo json_encode(["hiba" => "Nem lehet kapcsolódni az adatbázishoz"]);
    exit();
}

// Összes bevétel
$bev = $conn->query("SELECT SUM(osszeg) AS osszeg FROM bevetel");
$bev_total = $bev->fetch_assoc()["osszeg"];
if ($bev_total == null) $bev_total = 0;

// Összes kiadás
$kia = $conn->query("SELECT SUM(osszeg) AS osszeg FROM kiadas");
$kia_total = $kia->fetch_assoc()["osszeg"];
if ($kia_total == null) $kia_total = 0;

// Havi bevétel
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

// Havi kiadás
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

// Kategóriánkénti kiadás
$kat = $conn->query("
    SELECT kategoria, SUM(osszeg) AS osszeg
    FROM kiadas
    GROUP BY kategoria
");

$kat_array = [];
while ($sor = $kat->fetch_assoc()) {
    $kat_array[] = $sor;
}

// Válasz JSON formában
echo json_encode([
    "ossz_bevetel" => $bev_total,
    "ossz_kiadas" => $kia_total,
    "havi_bevetel" => $havi_bev_array,
    "havi_kiadas" => $havi_kia_array,
    "kategoriak" => $kat_array
]);

$conn->close();
?>
