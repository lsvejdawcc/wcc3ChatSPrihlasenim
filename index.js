const http = require("http");
const fs = require("fs"); //prace se soubory
const url = require("url"); //prace s adresou požadavku, parametry,...

const zpracovaniChatu = require("./sluzba-chat.js").zpracovaniPozadavku;
const zpracovaniUzivatelu = require("./sluzba-uzivatele.js").zpracovaniPozadavku;

let pocetPozadavku = 0;

function zpracovaniPozadavku(pozadavek, odpoved) {
  pocetPozadavku++; //zvyseni o 1

  //console.log("url: " + pozadavek.url);

  if (pozadavek.url == "/") {
    odpoved.writeHead(200, {"Content-type": "text/html"});
    let s = fs.readFileSync("index.html").toString();
    odpoved.end(s);
  } else if (pozadavek.url == "/style.css") {
    odpoved.writeHead(200, {"Content-type": "text/css"});
    let s = fs.readFileSync("style.css").toString();
    odpoved.end(s);
  } else if (pozadavek.url == "/script.js") {
    odpoved.writeHead(200, {"Content-type": "application/javascript"});
    let s = fs.readFileSync("script.js").toString();
    odpoved.end(s);
  } else if (pozadavek.url.startsWith("/chat")) {
    zpracovaniChatu(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/uzivatele")) {
    zpracovaniUzivatelu(pozadavek, odpoved);
  } else { //not found
    odpoved.writeHead(404);
    odpoved.end();
  }

}

let srv = http.createServer(zpracovaniPozadavku);
srv.listen(8080);
console.log("Aplikace běží na http://localhost:8080...");
