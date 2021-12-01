const url = require("url"); //prace s adresou požadavku, parametry,...
const fs = require("fs"); //prace se soubory
const requestIp = require('request-ip'); //zjisteni P adresy
const overeniTokenu = require("./sluzba-uzivatele.js").overeniTokenu; //import funkce

const SOUBOR_ZPRAVY = "zpravy.json";

let zpravy = []; //deklarace globalni promenne typu pole
if (fs.existsSync(SOUBOR_ZPRAVY)) {
  zpravy = JSON.parse(fs.readFileSync(SOUBOR_ZPRAVY));
}

exports.zpracovaniPozadavku = function (pozadavek,parametry,odpoved) {
  if (!overeniTokenu(parametry.token)) {
    odpoved.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "chyba";
    o.chyba = "neplatny uzivatel";
    odpoved.end(JSON.stringify(o));
    return;
  }

  if (pozadavek.url.startsWith("/chat/pridej")) {
    //pridani zpravy do seznamu zprav
    let z = {};
    z.prezdivka = parametry.prezdivka; 
    z.text = parametry.text;
    z.cas = Date.now();
    z.ip = requestIp.getClientIp(pozadavek); //pozadavek.connection.remoteAddress;
    zpravy.push(z);
    console.log(zpravy);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_ZPRAVY, JSON.stringify(zpravy, null, 2));

    //odpoved
    odpoved.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    odpoved.end(JSON.stringify(o));
  } else if (pozadavek.url.startsWith("/chat/nacti")) {
    //odpoved
    odpoved.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    o.zpravy = zpravy;
    odpoved.end(JSON.stringify(o));
  } else { //not found
    odpoved.writeHead(404);
    odpoved.end();
  }
}