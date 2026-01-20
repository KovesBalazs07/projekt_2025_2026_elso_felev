let tetelLista = JSON.parse(localStorage.getItem("tetelek")) || [];

const form = document.getElementById("tetelForm");
const tabla = document.getElementById("tetelTabla");

const tipus = document.getElementById("tipus");
const datum = document.getElementById("datum");
const kategoria = document.getElementById("kategoria");
const osszeg = document.getElementById("osszeg");
const megjegyzes = document.getElementById("megjegyzes");
const fizmod = document.getElementById("fizmod");

const kategoriak = {
  bevetel: [
    { value: "fizetes", text: "Fizetés" },
    { value: "ajandek", text: "Ajándék" },
    { value: "befektetes", text: "Befektetés" },
    { value: "egyeb", text: "Egyéb" }
  ],
  kiadas: [
    { value: "elelmiszer", text: "Élelmiszer" },
    { value: "rezsi", text: "Rezsi" },
    { value: "kozlekedes", text: "Közlekedés" },
    { value: "szorakozas", text: "Szórakozás" },
    { value: "egeszseg", text: "Egészség" },
    { value: "egyeb", text: "Egyéb" }
  ]
};

function kategoriatFrissit() {
  kategoria.innerHTML = "";
  const lista = kategoriak[tipus.value];

  for (let i = 0; i < lista.length; i++) {
    const opt = document.createElement("option");
    opt.value = lista[i].value;
    opt.textContent = lista[i].text;
    kategoria.appendChild(opt);
  }
}

function kategoriaSzoveg(tip, kat) {
  const lista = kategoriak[tip];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].value === kat) return lista[i].text;
  }
  return "Egyéb";
}

function fizmodSzoveg(fm) {
  if (fm === "készpénz" || fm === "készpenz") return "Készpénz";
  if (fm === "bankkártya") return "Bankkártya";
  return "Utalás";
}

function tablaSorkeszit(adat) {
  const sor = document.createElement("tr");
  sor.innerHTML = `
    <td>${adat.tipus === "bevetel" ? "Bevétel" : "Kiadás"}</td>
    <td>${adat.datum}</td>
    <td>${adat.kategoriaSzoveg}</td>
    <td>${adat.osszeg} Ft</td>
    <td>${adat.megjegyzes || ""}</td>
    <td>${adat.fizmodSzoveg}</td>
  `;
  tabla.appendChild(sor);
}

function mentesDB(adat) {
  let formData = new FormData();
  formData.append("datum", adat.datum);
  formData.append("kategoria", adat.kategoria);
  formData.append("osszeg", adat.osszeg);
  formData.append("megjegyzes", adat.megjegyzes);
  formData.append("fizmod", adat.fizmod);

  const url = adat.tipus === "bevetel"
    ? "php/mentes_bevetel.php"
    : "php/mentes_kiadas.php";

  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(r => r.json())
    .then(valasz => {
      console.log("Mentés:", valasz);
      if (!valasz.success) console.log("Mentési hiba:", valasz.message);
    })
    .catch(err => console.log("Fetch hiba:", err));
}

window.onload = function () {
  kategoriatFrissit();
};

tipus.addEventListener("change", kategoriatFrissit);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const ujTetel = {
    tipus: tipus.value,
    datum: datum.value,
    kategoria: kategoria.value,
    osszeg: osszeg.value,
    megjegyzes: megjegyzes.value,
    fizmod: fizmod.value,
    kategoriaSzoveg: kategoriaSzoveg(tipus.value, kategoria.value),
    fizmodSzoveg: fizmodSzoveg(fizmod.value)
  };

  tablaSorkeszit(ujTetel);

  tetelLista.push(ujTetel);
  localStorage.setItem("tetelek", JSON.stringify(tetelLista));

  mentesDB(ujTetel);

  form.reset();
  kategoriatFrissit();
});
