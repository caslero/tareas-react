import { LoginModelo } from "../Model/LoginModelo.js";
import { TareaModelo } from "../Model/TareaModelo.js";
import { sendMail } from "../validaciones/UsuarioValidar.js";
import { validarCampos,  tokenCookieSesion, } from "../validaciones/UsuarioValidar.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

/** La clase LoginController se encarga de analizar las diferentes peticiones que
  deben cumplirse para que un usuario pueda iniciar sesion correctamente */
export class LoginControlador {
  /** iniciarSesion sen encarga de responder la petision para iniciar sesion en
    caso de cumplirse todas las condiciones */
  static async iniciarSesion(req, res) {
    const correo = req.body.correo;
    const clave = req.body.clave;
    let claveAprobada = "";

    const respuesta = validarCampos(req, res);

    if (respuesta) {
      res.send({
        status: respuesta.status,
        numero: respuesta.numero,
        message: respuesta.message,
      });
    } else {
      const usuarioExiste = await LoginModelo.existeUsuario(correo);
      if (usuarioExiste == 0) {
        res.send({
          status: "error",
          numero: 0,
          message: "Usuario no existe",
        });
      } else {
        const claveGuardada = await LoginModelo.claveUsuario(correo);
        claveAprobada = claveGuardada[0].clave;
        const comparada = await bcryptjs.compare(clave, claveAprobada);
        if (comparada) {
          const userAutorizado = await LoginModelo.usuarioAutorizado(correo);
          if (userAutorizado[0].autenticar === "false") {
            const tokeAutenticacion = await LoginModelo.tokenValidarUsuario(correo);
            /** nombreUsuario ese linea viene de TareaModelo */
            const nombreUsuario = await TareaModelo.nombreUsuarioActivo(correo);
            sendMail(correo, nombreUsuario[0].nombre, tokeAutenticacion[0].token);

            res.send({
              status: "error",
              numero: 0,
              message: "Usuario no autorizado, valide en su correo",
            });
          } else {
            const optCookie = tokenCookieSesion(correo);
            res.send({
              status: "ok",
              numero: 1,
              message: "Logueo exitoso",
              token: optCookie.token,
              cookie: optCookie.cookieOption,
              redirect: "/tareas",
            });
          }
        } else {
          res.send({
            status: "error",
            numero: 0,
            message: "Clave incorrecta",
          });
        }
      }
    }
  }

  /** La funcion cerrarSesion solo se encarga de borrar el token de sesion */
  static async cerrarSesion(req, res) {
    res.clearCookie('jwt');
    res.send({
        status: "error",
        numero: 0,
        message: "Cerrando sesion"
    })
  }
}
