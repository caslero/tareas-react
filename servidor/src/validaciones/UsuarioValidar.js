import nodemailer from "nodemailer";
import { htmlEmail, htmlEmailCambiarClave } from "../plantillas/email.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

let respuesta = "";
let tieneCaracteres = false;
let tieneNumeros = false;

const caracteresEspeciales = /[!@#$%^&*-]/;
const tieneMayuscula = /[A-Z]/;
const tieneMinuscula = /[a-z]/;
const tieneNumero = /[0-9]/;
const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** La function validarCampos() es la encargada de validar todos los campos con los
  formatos correctos */
export function validarCampos(req, res) {
  try {
    const url = req.body.urlUsuarioLogin;
    const clave = req.body.clave;
    const correo = req.body.correo;

    if (url === "usuario") {
      const clave2 = req.body.clave2;
      const nombre = req.body.nombre;
      if (!nombre || !correo || !clave || !clave2) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Uno o varios campos vacios",
        };
        return respuesta;
      }

      if (nombre.length != 0) {
        for (let i = 0; i < nombre.length; i++) {
          let char = nombre.charAt(i);
          if (
            (!tieneCaracteres && /[^\w\s]/.test(char)) ||
            (!tieneNumeros && /[0-9]/.test(char)) ||
            (tieneCaracteres && tieneNumeros)
          ) {
            respuesta = {
              status: "error",
              numero: 0,
              message: "Campo nombre solo acepta letras",
            };
            return respuesta;
          }
        }
      }

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

      if (clave != clave2) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Claves no coinciden",
        };
        return respuesta;
      } else {
        if (clave.length < 5 || clave.length > 16) {
          respuesta = {
            status: "error",
            numero: 0,
            message: "Clave: entre 5 y 16 caracteres",
          };
          return respuesta;
        } else if (!caracteresEspeciales.test(clave)) {
          respuesta = {
            status: "error",
            numero: 0,
            message: "Agregue al menos un carácter especial [(!@#$%^&*)]",
          };
          return respuesta;
        } else if (!tieneMayuscula.test(clave) || !tieneMinuscula.test(clave)) {
          respuesta = {
            status: "error",
            numero: 0,
            message: "Agregue al menos una mayuscula",
          };
          return respuesta;
        } else if (!tieneNumero.test(clave)) {
          respuesta = {
            status: "error",
            numero: 0,
            message: "Agregue al menos un numero",
          };
          return respuesta;
        }
      }
    } else if (url === "login") {
      if (!correo || !clave) {
        respuesta = {
          status: "error",
          numero: 0,
          message: "Uno o varios campos vacios",
        };
        return respuesta;
      }

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
    }
  } catch (error) {
    console.log("validarCampos: " + error);
  }
}

/** La const transporte es la encargada de hacer la conexion con mailtrap, la
        cual es un simulador para enviar correos */
let transporte = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

/** La function senMail es la encargada de enviar el correo para validar el usuario
    recien registrado */
export async function sendMail(correo, nombre, validarUsuario) {
  const info = await transporte.sendMail({
    from: `${process.env.REMITENTE} <${process.env.CORREO_REMITENTE}>`,
    to: `${correo}`,
    subject: `Hola ${nombre}, bienvenido a tu comunidad...`,
    html: `${htmlEmail(validarUsuario)}`,
  });
  return info;
}

/** La function sendMailCambiarClave es la encargada de enviar el correo para
  que el usuario pueda cambiar su clave de acceso */
export async function sendMailCambiarClave(correo, nombre, validarUsuario) {
  const info = await transporte.sendMail({
    from: `${process.env.REMITENTE} <${process.env.CORREO_REMITENTE}>`,
    to: `${correo}`,
    subject: `Hola ${nombre}, bienvenido a tu comunidad...`,
    html: `${htmlEmailCambiarClave(validarUsuario)}`,
  });
  return info;
}

/** tokenValidarUsuario es la encargada de generar el token para validar el
  usuario que se acaba de registrar */
export const tokenValidarUsuario = (num) => {
  let result1 = Math.random().toString(34).substring(0, num);
  let result2 = Math.random().toString(34).substring(0, num);
  const token1 = result1
    .split("; ")
    .find((cookie) => cookie.startsWith("0."))
    .slice(2);
  const token2 = result2
    .split("; ")
    .find((cookie) => cookie.startsWith("0."))
    .slice(2);

  return token1 + token2;
};

/** La funcion tokenCookieSesion crea un token y cookie para iniciar sesion */
export function tokenCookieSesion(correos) {
  const correo = correos;
  
  const token = jsonwebtoken.sign(
    {
      correo: correo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
    }
  );

  const cookieOption = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    domain: "localhost:5173",
    path: "/",
    httpOnly: true,
    sameSite: 'None',
    secure: false,
  };

  respuesta = {
    token: token,
    cookieOption: cookieOption,
  }

  return respuesta;
}

export function validarCamposNuevaClave(clave, clave2) {
  if (!clave || !clave2) {
    respuesta = {
      status: "error",
      numero: 0,
      message: "Uno o varios campos vacios",
    };
    return respuesta;
  }

  if (clave != clave2) {
    respuesta = {
      status: "error",
      numero: 0,
      message: "Claves no coinciden",
    };
    return respuesta;
  } else {
    if (clave.length < 5 || clave.length > 16) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Clave: entre 5 y 16 caracteres",
      };
      return respuesta;
    } else if (!caracteresEspeciales.test(clave)) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Agregue al menos un carácter especial [(!@#$%^&*)]",
      };
      return respuesta;
    } else if (!tieneMayuscula.test(clave) || !tieneMinuscula.test(clave)) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Agregue al menos una mayuscula",
      };
      return respuesta;
    } else if (!tieneNumero.test(clave)) {
      respuesta = {
        status: "error",
        numero: 0,
        message: "Agregue al menos un numero",
      };
      return respuesta;
    }
  }

}
