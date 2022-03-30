const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const nuevoRoommater = async () => {
  try {
    const { data } = await axios.get("https://randomuser.me/api");
    const roommater = data.results[0];
    const usuario = {
      id: uuidv4().slice(30),
      correo: roommater.email,
      nombre: `${roommater.name.title} ${roommater.name.first} ${roommater.name.lastname}`,
    };
    return usuario;
  } catch (e) {
    throw e;
  }
};

const guardarRoommater = (roommater) => {
  const roommaterJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  roommaterJSON.roommater.push(roommater);
  fs.writeFileSync("roommates.json", JSON.stringify(roommaterJSON));
};
module.exports = { nuevoRoommater, guardarRoommater };
