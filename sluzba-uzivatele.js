const url = require("url"); //prace s adresou požadavku, parametry,...
const fs = require("fs"); //prace se soubory
const requestIp = require('request-ip'); //zjisteni P adresy
const crypto = require("crypto");

const SOUBOR_UZIVATELE = "uzivatele.json";

let uzivatele = []; //deklarace globalni promenne typu pole
if (fs.existsSync(SOUBOR_UZIVATELE)) {
  uzivatele = JSON.parse(fs.readFileSync(SOUBOR_UZIVATELE));
}

function zahashujHeslo(heslo) {
  let kZahashovani = heslo + "$wcc3@2021=";
  return crypto.createHash("sha256").update(kZahashovani).digest('hex');
}

exports.zpracovaniPozadavku = function (pozadavek,parametry,odpoved) {
  if (pozadavek.url.startsWith("/uzivatele/registruj")) {
    //kontrola existence prihlasovaciho jmena
    for (let u of uzivatele) {
      if (u.prihlasovacijmeno == parametry.prihljm) {
        let o = {};
        o.stav = "chyba";
        o.chyba = "Uživatel existuje!";
        odpoved.end(JSON.stringify(o));
        return;        
      }
    }

    //pridani uzivatele do seznamu uzivatelu
    let u = {};
    u.plnejmeno = parametry.plnejmeno; 
    u.prihlasovacijmeno = parametry.prihljm;
    u.heslo = zahashujHeslo(parametry.heslo); 
    u.casregistrace = Date.now();
    u.ip = requestIp.getClientIp(pozadavek); //pozadavek.connection.remoteAddress;
    uzivatele.push(u);
    console.log(uzivatele);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_UZIVATELE, JSON.stringify(uzivatele, null, 2));

    //odpoved
    odpoved.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    odpoved.end(JSON.stringify(o));
  } else if (pozadavek.url.startsWith("/uzivatele/prihlas")) {
    //kontrola existence prihlasovaciho jmena
    for (let u of uzivatele) {
      if (u.prihlasovacijmeno == parametry.prihljm) {
        if (u.heslo == zahashujHeslo(parametry.heslo)) {
          let token = crypto.randomBytes(16).toString('hex');
          u.token = token;
          u.platnostTokenuDo = Date.now() + 60 * 1000; //platnost tokenu vyprsi za minutu

          //odpoved
          odpoved.writeHead(200, {"Content-type": "application/json"});
          let o = {};
          o.stav = "ok";
          o.token = token;
          o.plnejmeno = u.plnejmeno;
          odpoved.end(JSON.stringify(o));
          return;
        }
      }
    }
    let o = {};
    o.stav = "chyba";
    o.chyba = "Uživatel neexistuje nebo nesouhlasí heslo!";
    odpoved.end(JSON.stringify(o));
  } else { //not found
    odpoved.writeHead(404);
    odpoved.end();
  }
}

exports.overeniTokenu = function (token) {
  for (let u of uzivatele) {
    if (u.token == token) {
      if (Date.now() < u.platnostTokenuDo) {
        u.platnostTokenuDo = Date.now() + 60 * 1000; //platnost tokenu vyprsi za minutu
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}  