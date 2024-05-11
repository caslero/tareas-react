import jsonwebtoken from "jsonwebtoken";

let respuesta = "";
const caracteresEspeciales = /[!@#$%^&*-]/;
const tieneMayuscula = /[A-Z]/;
const tieneMinuscula = /[a-z]/;
const tieneNumero = /[0-9]/;

/** La funcion cookieDecodificada, descifra la cookie con la finalidad de
  saber si el usuario esta o no autorizado para permanecer en cierto sitio */
export function cookieDecodificada(req) {
  try {
    const cookieJWT = req.headers.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("jwt="))
      .slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);

    const correo = decodificada.correo;
    respuesta = {
      status: "ok",
      numero: 1,
      message: "Correo correcto",
      correo: correo,
    };
    return respuesta;
  } catch (error) {
    console.log("error, decodificando: " + error);
    if (error == 'TokenExpiredError: jwt expired') {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Token vencido",
      };
      return respuesta;
    } else {
      respuesta = {
      status: "error",
      numero: 0,
      message: "Token o cookie incorrectos",
    };
    return respuesta;
    }    
  }
}

/** La funcion validarCamposTareas se encarga de validar los campos del cambio
  de clave una vez iniciada sesion */
export function validarCamposTareas(req, res) {
  try {
    const claveVieja = req.body.claveVieja;
    const claveNueva = req.body.claveNueva;
    const claveNueva2 = req.body.claveNueva2;

    if (!claveVieja || !claveNueva || !claveNueva2) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Uno o varios campos vacios",
      };
      return respuesta;
    }

    if (claveNueva != claveNueva2) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Claves no coinciden",
      };
      return respuesta;
    } else {
      if (claveNueva.length < 5 || claveNueva.length > 16) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Clave: entre 5 y 16 caracteres",
        };
        return respuesta;
      } else if (!caracteresEspeciales.test(claveNueva)) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Agregue al menos un carácter especial [(!@#$%^&*)]",
        };
        return respuesta;
      } else if (!tieneMayuscula.test(claveNueva) || !tieneMinuscula.test(claveNueva)) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Agregue al menos una mayuscula",
        };
        return respuesta;
      } else if (!tieneNumero.test(claveNueva)) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Agregue al menos un numero",
        };
        return respuesta;
      }
    }

  } catch(error) {
    console.log('Error, TareaValidar.js: ' + error);
  }
}

