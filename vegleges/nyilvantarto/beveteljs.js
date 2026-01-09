let bevetelLista = JSON.parse(localStorage.getItem("bevetelek")) || [];

const tabla = document.querySelector("#bevtabla");
const form = document.querySelector(".input-form");

window.onload = function () {
    bevetelLista.forEach(b => tablaSorkeszit(b));
};

form.addEventListener("submit", function (e) 
{
    e.preventDefault();

    const mezok = form.querySelectorAll("input, select");

    const ujBevetel = {
        datum: mezok[0].value,
        kategoria: mezok[1].value,
        osszeg: mezok[2].value,
        megjegyzes: mezok[3].value,
        fizmod: mezok[4].value
    };

    tablaSorkeszit(ujBevetel);

    bevetelLista.push(ujBevetel);
    localStorage.setItem("bevetelek", JSON.stringify(bevetelLista));

    mentesBevetel();
    form.reset();

});

function tablaSorkeszit(adat) 
{
    const sor = document.createElement("tr");

    sor.innerHTML = `
        <td>${adat.datum}</td>
        <td>${szovegesKategoria(adat.kategoria)}</td>
        <td>${adat.osszeg} Ft</td>
        <td>${adat.megjegyzes}</td>
        <td>${szovegesFizmod(adat.fizmod)}</td>
    `;

    tabla.appendChild(sor);
}

function szovegesKategoria(kat) 
{
    if (kat === "fizetes") return "Fizetés";
    if (kat === "ajandek") return "Ajándék";
    if (kat === "befektetes") return "Befektetés";
    return "Egyéb";
}

function szovegesFizmod(fm) 
{
    if (fm === "készpénz") return "Készpénz";
    if (fm === "bankkártya") return "Bankkártya";
    return "Utalás";
}

function mentesBevetel() 
{
    let formData = new FormData();
    formData.append("datum", document.getElementById("ido").value);
    formData.append("kategoria", document.getElementById("kategor").value);
    formData.append("osszeg", document.getElementById("szam").value);
    formData.append("megjegyzes", document.getElementById("szoveg").value);
    formData.append("fizmod", document.getElementById("mod").value);
    console.log(Array.from(formData));

    fetch("php/mentes_bevetel.php",
    {
        method: "POST",
        body: formData
    })
    .then(r => r.text())
    .then(t => 
    {
        console.log("PHP válasz:", t);
    })
}
