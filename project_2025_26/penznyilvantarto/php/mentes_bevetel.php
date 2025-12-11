<?php
header("Content-Type: application/json; charset=utf-8");

// MySQL kapcsolat
$conn = new mysqli("localhost", "root", "", "penznyilvantarto");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba"]);
    exit();
}

// Adatok fogadása
$datum = $_POST["datum"];
$kategoria = $_POST["kategoria"];
$osszeg = $_POST["osszeg"];
$megjegyzes = $_POST["megjegyzes"];
$fizmod = $_POST["fizmod"];

// SQL beszúrás
$sql = "INSERT INTO bevetel (datum, kategoria, osszeg, megjegyzes, fizetesi_mod)
        VALUES ('$datum', '$kategoria', '$osszeg', '$megjegyzes', '$fizmod')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Bevétel sikeresen mentve"]);
} else {
    echo json_encode(["success" => false, "message" => "Mentési hiba"]);
}

$conn->close();
?>
