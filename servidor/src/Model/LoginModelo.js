import { conexion } from "../db/conexion.js";
import {
  existeUsuario,
  claveGuardadaUsuario,
  usuarioAutenticado,
  tokenAutenticarUsuario,
} from "../sql/LoginSentencia.js";

/** La clase LoginModelo contiene todos los resultado de las sentencias sql que
    se hacen para poder iniciar sesion */
export class LoginModelo {
  /** La funcion existeUsuario consulta si existe o no el usuario para poder
    iniciar sesion */
  static async existeUsuario(correo) {
    return new Promise((resolve) => {
      conexion.query(existeUsuario(correo), async function (error, resultado) {
        if (resultado.length != 0) {
          resolve(resultado[0].usuarioExiste);
        } else {
          resolve(resultado[0].usuarioExiste);
        }
      });
    });
  }

  /** La funcion claveUsuario trae la clave guardada para compararla con la que
    envia envia el cliente, con el fin de compararla e iniciar sesion */
  static async claveUsuario(correo) {
    return new Promise((resolve) => {
      conexion.query(
        claveGuardadaUsuario(correo),
        async function (error, resultado) {
          if (resultado.length != 0) {
            resolve(resultado);
          } else {
            resolve(resultado);
          }
        }
      );
    });
  }

  /** La funcion usuarioAutorizado nos trae el campo autenticar para compararlo
    luego para saber si el usuario esta autorizado o no */
  static async usuarioAutorizado(correo) {
    return new Promise((resolve) => {
      conexion.query(
        usuarioAutenticado(correo),
        async function (error, resultado) {
          if (resultado.length != 0) {
            resolve(resultado);
          } else {
            resolve(resultado);
          }
        }
      );
    });
  }

  /** La funcion tokenValidarUsuario consultamos el token que se guardo en la bd
    con la finalidad de autenticar el usuario */
  static async tokenValidarUsuario(correo) {
    return new Promise((resolve) => {
      conexion.query(
        tokenAutenticarUsuario(correo),
        async function (error, resultado) {
          if (resultado.length != 0) {
            resolve(resultado);
          } else {
            resolve(resultado);
          }
        }
      );
    });
  }
}
