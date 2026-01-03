fetch("php/mentes_statisztika.php")
  .then(r => r.json())
  .then(adatok => {

    console.log(adatok);

    const osszBevetel = Number(adatok.ossz_bevetel);
    const osszKiadas = Number(adatok.ossz_kiadas);

    const maiDatum = new Date().getDate();
    let napiBev = 0;
    let napiKia = 0;

    for (let i = 0; i < adatok.havi_bevetel.length; i++) {
      if (adatok.havi_bevetel[i].honap == (new Date().getMonth() + 1)) {
        napiBev += Number(adatok.havi_bevetel[i].osszeg) / 30; 
      }
    }

    for (let i = 0; i < adatok.havi_kiadas.length; i++) {
      if (adatok.havi_kiadas[i].honap == (new Date().getMonth() + 1)) {
        napiKia += Number(adatok.havi_kiadas[i].osszeg) / 30;
      }
    }

    document.getElementById("napibevetel").textContent = Math.round(napiBev) + " Ft";
    document.getElementById("napikiadas").textContent = Math.round(napiKia) + " Ft";

    let hetiBev = Math.round(napiBev * 7);
    let hetiKia = Math.round(napiKia * 7);

    document.getElementById("hetibevetel").textContent = hetiBev + " Ft";
    document.getElementById("hetikiadas").textContent = hetiKia + " Ft";

    let haviBev = 0;
    let haviKia = 0;

    for (let i = 0; i < adatok.havi_bevetel.length; i++) {
      if (adatok.havi_bevetel[i].honap == (new Date().getMonth() + 1)) {
        haviBev = Number(adatok.havi_bevetel[i].osszeg);
      }
    }

    for (let i = 0; i < adatok.havi_kiadas.length; i++) {
      if (adatok.havi_kiadas[i].honap == (new Date().getMonth() + 1)) {
        haviKia = Number(adatok.havi_kiadas[i].osszeg);
      }
    }

    document.getElementById("havibevetel").textContent = haviBev + " Ft";
    document.getElementById("havikiadas").textContent = haviKia + " Ft";

    new Chart(document.getElementById("napistatisztika"), {
      type: "bar",
      data: {
        labels: ["Bevétel", "Kiadás"],
        datasets: [{
          label: "Ft",
          data: [Math.round(napiBev), Math.round(napiKia)]
        }]
      }
    });

    new Chart(document.getElementById("hetistatisztika"), {
      type: "bar",
      data: {
        labels: ["Bevétel", "Kiadás"],
        datasets: [{
          label: "Ft",
          data: [hetiBev, hetiKia]
        }]
      }
    });

    new Chart(document.getElementById("havistatisztika"), {
      type: "bar",
      data: {
        labels: ["Bevétel", "Kiadás"],
        datasets: [{
          label: "Ft",
          data: [haviBev, haviKia]
        }]
      }
    });

  })
  .catch(err => {
    console.error("Hiba a statisztika lekérésekor:", err);
  });