import { conexion } from "../db/conexion.js";
import {
  existeToken,
  correoExiste,
  tokenVencido,
  tokenValido,
  desactivarTokenVencido,
} from "../sql/TokenSentencia.js";

/** La clase TokenModelo se encarga de los procesos referente a los tokens
    de cambio de clave */
export class TokenModelo {
  /** La funcion validandoToken consulta si existe o no el token para el
    cambio de clave */
  static async validandoToken(token) {
    return new Promise((resolve) => {
      conexion.query(existeToken(token), async function (error, resultado) {
        if (resultado.length != 0) {
          resolve(resultado[0].tokenExiste);
        } else {
          resolve(resultado[0].tokenExiste);
        }
      });
    });
  }

  /** La funcion correoTokenCambioClave nos trae el correo del token que lo
    representa para el cambio de clave */
  static async correoTokenCambioClave(token) {
    return new Promise((resolve) => {
      conexion.query(correoExiste(token), async function (error, resultado) {
        if (resultado.length != 0) {
          resolve(resultado);
        } else {
          resolve(resultado);
        }
      });
    });
  }

  /** La funcion tokenUtilizado consulta el token para saber si esta vencido
    o no */
  static async tokenUtilizado(token) {
    return new Promise((resolve) => {
      conexion.query(tokenVencido(token), async function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /** La funcion ultimoToken trae todos los token que ha solicitado un usuario
    para cambiar la clave del usuario, esto con el fin de saber cual ha
    expirado y cual no */
  static async ultimoToken(correo) {
    return new Promise((resolve) => {
      conexion.query(tokenValido(correo), function (error, resultado) {
        if (!error) {
          resolve(resultado);
        } else {
          resolve(false);
        }
      });
    });
  }

  /** La funcion tokensSinUtilizar desactiva los tokens que no se usaron */
  static async tokensSinUtilizar(correo, id) {
    return new Promise((resolve) => {
      conexion.query(
        desactivarTokenVencido(correo, id),
        async function (error, resultado) {
          if (!error) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }
}
