const fs = require("fs");
const http = require("http");
const { nuevoRoommater, guardarRoommater } = require("./roomates")
const { enviar } = require("./mailer")


http.createServer((req, res) => {
  if (req.url == "/" && req.method == "GET") {
    res.setHeader("Content-Type", "utf8");
    res.end(fs.readFileSync("index.html", "utf8"));
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

  if(req.url.startsWith("/roommate") && req.method == "POST"){
      res.setHeader("Content-Type", "application/json")
      res.end(fs.readFileSync("rommates.json", "utf8"));
  }

  if(req.url.startsWith("/gastos") && req.method == "GET"){
    res.setHeader("Content-Type", "application/json")
    res.end(fs.readFileSync("gastos.json", "utf8"));
  }

  if(req.url.startsWith("/gasto") && req.method == "PUT"){
    let body = "";
    req.on("data", (chunk) => {
        body = chunk.toString()
    });
    req.on("end", () => {
        const nuevoGasto = JSON.stringify(body)
        fs.writeFile("gastos.json", JSON.stringify(nuevoGasto), (err) => {
            err ? console.log("No funciona"): console.log("Todo bien")
            res.end("Gasto editado con éxito")
        })
    })
  }
  
  if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query
      //gastos.json.
  }
});
