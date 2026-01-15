fetch("php/mentes_statisztika.php")
  .then(r => r.json())
  .then(a => {

    document.getElementById("napibevetel").innerText = a.napi.bevetel + " Ft";
    document.getElementById("napikiadas").innerText  = a.napi.kiadas + " Ft";

    document.getElementById("hetibevetel").innerText = a.heti.bevetel + " Ft";
    document.getElementById("hetikiadas").innerText  = a.heti.kiadas + " Ft";

    document.getElementById("havibevetel").innerText = a.havi.bevetel + " Ft";
    document.getElementById("havikiadas").innerText  = a.havi.kiadas + " Ft";

    return fetch("php/mentes_statisztika_db.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        napi: { bevetel: a.napi.bevetel, kiadas: a.napi.kiadas },
        heti: { bevetel: a.heti.bevetel, kiadas: a.heti.kiadas },
        havi: { bevetel: a.havi.bevetel, kiadas: a.havi.kiadas }
      })
    });
  })
  .then(r => r.json())
  .then(v => {
    if (!v.ok) console.log("Statisztika mentés hiba:", v.hiba);
  })
  .catch(err => console.log("Hiba:", err));
