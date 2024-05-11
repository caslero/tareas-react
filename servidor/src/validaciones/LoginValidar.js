let respuesta = "";
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function vCorreoCambiarClave(req, res) {
  try {
    const correo = req.body.correo;
    if (correo.length != 0) {
      if (!formatoCorreo.test(correo)) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Formato de correo invalido",
        };
        return respuesta;
      }
    }
  } catch (error) {
    console.log("Error. LoginValidar.js: " + error);
  }
}
