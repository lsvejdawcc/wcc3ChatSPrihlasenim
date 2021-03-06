async function poNacteni() {
  document.getElementById("zprava").addEventListener("keydown", stiskKlavesyDolu);

  ukazPrihlaseni();
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
  let body = {};
  body.token = tokenUzivatele;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  //console.log(data);

  if (data.stav != "ok") {
    console.error(data.chyba);
    return;
  }


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
  let url = location.href + "chat/pridej";
  let body = {};
  body.token = tokenUzivatele;
  body.text = z;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
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
  let url = location.href + "uzivatele/registruj";
  let body = {};
  body.plnejmeno = plnejm;
  body.prihljm = prihljm;
  body.heslo = heslo;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }

  //vysledek
  //document.getElementById("vysledek").innerHTML = data.vysledek;
}

let tokenUzivatele;
async function prihlas() {
  //nacteni vstupu ze stranky
  let prihljm = document.getElementById("loginprihljmeno").value;
  let heslo = document.getElementById("loginheslo").value;

  //sestaveni url vcetne parametru
  let url = location.href + "uzivatele/prihlas";
  let body = {};
  body.prihljm = prihljm;
  body.heslo = heslo;
  let response = await fetch(url,{method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.stav != "ok") {
    alert(data.chyba);
    return;
  }

  //vysledek
  tokenUzivatele = data.token;
  setInterval(nactiZpravy, 1000);
  ukazKomunikaci();
}

function ukazRegistraci() {
  document.getElementById("oblast_registrace").style.display = "block";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "none";
}

function ukazPrihlaseni() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "block";
  document.getElementById("oblast_komunikace").style.display = "none";
}

function ukazKomunikaci() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "block";
}