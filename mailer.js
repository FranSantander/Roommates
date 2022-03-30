const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chileinfoclub@gmail.com",
    pass: "2022@infoclub",
  },
});

const enviar = async (to, subject, html) => {
  let mailOptions = {
    from: "chileinfoclub@gmail.com",
    to: [],
    subject: `Comunicado de un ${nuevoGasto}`,
    html: `<p>Hola: El ${usuario.nombre} ha generado un ${nuevoGasto}</p>`,
  };
  try {
    const gastoNuevo = await transporter.sendMail(mailOptions);
    return gastoNuevo;
  } catch (e) {
    throw e;
  }
};

module.exports = { enviar };
