let kiadasLista = JSON.parse(localStorage.getItem("kiadasok")) || [];

const tabla = document.querySelector("table");
const form = document.querySelector(".input-form");

window.onload = function () {
    kiadasLista.forEach(b => tablaSorkeszit(b));
};

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const mezok = form.querySelectorAll("input, select");

    const ujKiadas = {
        datum: mezok[0].value,
        kategoria: mezok[1].value,
        osszeg: mezok[2].value,
        megjegyzes: mezok[3].value,
        fizmod: mezok[4].value
    };

    tablaSorkeszit(ujKiadas);

    kiadasLista.push(ujKiadas);
    localStorage.setItem("kiadasok", JSON.stringify(kiadasLista));

    form.reset();
});

function tablaSorkeszit(adat) {
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

function szovegesKategoria(kat) {
    if (kat === "elelmiszer") return "Élelmiszer";
    if (kat === "rezsi") return "Rezsi";
    if (kat === "kozlekedes") return "Közlekedés";
    if (kat === "szorakozas") return "Szórakozás";
    if (kat === "egeszseg") return "Egészség";
    return "Egyéb";
}

function szovegesFizmod(fm) {
    if (fm === "készpénz" || fm === "készpenz") return "Készpénz";
    if (fm === "bankkártya") return "Bankkártya";
    return "Utalás";
}