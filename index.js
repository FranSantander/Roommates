const fs = require("fs");
const http = require("http");
const { nuevoRoommater, guardarRoommater } = require("./roomates");
const { enviar } = require("./mailer");
const { v4: uuidv4 } = require("uuid");
const url = require("url");

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("Content-Type", "utf8");
      res.end(fs.readFileSync("index.html", "utf8"));
    }
    //e. GET /roommates: Devuelve todos los roommates almacenados en el servidor (roommates.json)
    let nuevoGastoJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    let gastos = nuevoGastoJSON.gastos;
    if (req.url.startsWith("/roommates") && req.method == "GET") {
      res.end(JSON.stringify(nuevoGastoJSON));
    }

    if (req.url.startsWith == "/roommate" && req.method == "POST") {
      nuevoRoommater()
        .then(async (roommater) => {
          guardarRoommater(roommater);
          res.end(JSON.stringify({ roommater }));
        })
        .catch((e) => {
          res.statusCode = 500;
          res.end();
          console.log("Error en registar al usuario random", e);
        });
    }
    // /roommate POST:Almacena un nuevo roommate ocupando random user.
    if (req.url.startsWith("/roommate") && req.method == "POST") {
      res.setHeader("Content-Type", "application/json");
      res.end(fs.readFileSync("roommates.json", "utf8"));
    }
    //a. GET /gastos: Devuelve todos los gastos almacenados en el archivo gastos.json.
    if (req.url.startsWith("/gastos") && req.method == "GET") {
      res.setHeader("Content-Type", "application/json");
      res.end(fs.readFileSync("gastos.json", "utf8"));
    }
    //b. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un archivo JSON (gastos.json).
    if (req.url.startsWith("/gasto") && req.method == "POST") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        gasto = {
          id: uuidv4().slice(30),
          roommater: body.roommater,
          descripcion: body.descripcion,
          monto: body.monto,
        };
        gastos.push(gasto);
        fs.writeFileSync("gastos.json", JSON.stringify(nuevoGastoJSON));
        res.end();
      });
    }
    //c. PUT /gasto: Recibe el payload de la consulta y modifica los datos almacenados en el servidor (gastos.json).
    if (req.url.startsWith("/gasto") && req.method == "PUT") {
      let body = "";
      const { id } = url.parse(req.url, true).query;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
        body.id = id;
      });
      req.on("end", () => {
        const nuevoGasto = JSON.stringify(body);
        fs.writeFile("gastos.json", JSON.stringify(nuevoGasto), (err) => {
          err ? console.log("No funciona") : console.log("Todo bien");
          res.end("Gasto editado con éxito");
        });
      });
    }
    //d. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine del historial de gastos (gastos.json).
    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      nuevoGastoJSON.gastos = gastos.filter((g) => g.id !== id);
      fs.writeFileSync("gastos.json", JSON.stringify(nuevoGastoJSON));
      res.end();
    }
  })
  .listen(3000, console.log("Servidor encendido en el puerto 3000"));
