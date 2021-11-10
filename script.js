async function poNacteni() {
  document.getElementById("zprava").addEventListener("keydown", stiskKlavesyDolu);

  setInterval(nactiZpravy, 1000);
}

function stiskKlavesyDolu(udalost) {
  //console.log(udalost);
  if (udalost.key == "Enter") {
    odesliZpravu();
  }
}

async function nactiZpravy() {
  //sestaveni url vcetne parametru
  let url = location.href + "chat/nacti";
  console.log(url);
  let response = await fetch(url);
  let data = await response.json();
  //console.log(data);

  let s = "";
  for (let zprava of data.zpravy) {
    let dt = new Date(zprava.cas); //nastavi datum a cas podle ms v parametru
    s = dt.toLocaleString() + " " + zprava.prezdivka+": "+zprava.text+"<br>" + s;
  }
  document.getElementById("zpravy").innerHTML = s;
}

async function odesliZpravu() {
  //nacteni vstupu ze stranky
  let p = document.getElementById("prezdivka").value;
  let z = document.getElementById("zprava").value;
  document.getElementById("zprava").value = "";
  document.getElementById("zprava").focus();

  if (z == "") return; //pri prazdne zprave se funkce hned ukonci

  //sestaveni url vcetne parametru
  let url = location.href + "chat/pridej?prezdivka="+p+"&text="+z;
  console.log(url);
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);

  //vysledek
  //document.getElementById("vysledek").innerHTML = data.vysledek;
}

async function registruj() {
  //nacteni vstupu ze stranky
  let plnejm = document.getElementById("plnejmeno").value;
  let prihljm = document.getElementById("prihljmeno").value;
  let heslo = document.getElementById("heslo").value;
  let heslo2 = document.getElementById("heslo2").value;

  if (prihljm == "") {
    alert("Prazdne prihlasovaci jmeno!");
    return;
  }
  if (heslo == "") {
    alert("Prazdne heslo!");
    return;
  }
  if (heslo != heslo2) {
    alert("Chybne zopakovane heslo!");
    return;
  }

  //sestaveni url vcetne parametru
  let url = location.href + "uzivatele/registruj?plnejmeno="+plnejm+"&prihljm="+prihljm+"&heslo="+heslo;
  console.log(url);
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }

  //vysledek
  //document.getElementById("vysledek").innerHTML = data.vysledek;
}

