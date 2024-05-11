import { conexion } from "../db/conexion.js";
import {
  guardarUsuario,
  usuarioExiste,
  usuarioYaAutenticado,
  usuarioAutenticado,
  cambioClaveUsuario,
  saveTokenCambioClave
} from "../sql/UsuarioSentencia.js";

export class UsuarioModelo {
  /** La funcion registrarNuevoUsuario se encarga de guardar un nuevo usuario */
  static async registrarNuevoUsuario(nombre, correo, clave, token) {
    const valido = false;
    return new Promise((resolve) => {
      conexion.query(
        guardarUsuario(nombre, correo, clave, token, valido),
        function (error, resultado) {
          if (!error) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  /** La funcion existeUsuario se encarga de traernos el nombre de usuario en caso
    de que el usuario exista  */
  static async existeUsuario(correo) {
    return new Promise((resolve) => {
      conexion.query(usuarioExiste(correo), function (error, resultado) {
        if (resultado.length != 0) {
          resolve(resultado[0].nombre);
        } else {
          resolve((resultado = 0));
        }
      });
    });
  }

  /** La funcion estaAutenticado se encarga de verificar si el usuario se verifico
    o no con el fin de que la proxima funcion autentique o no */
  static async estaAutenticado(token) {
    let resul = "";
    return new Promise((resolve) => {
      conexion.query(usuarioYaAutenticado(token), function (error, resultado) {
        if (resultado.length != 0) {
          resul = resultado[0].autenticar;
          if (resul === "true") {
            resolve((resul = 1));
          } else {
            resolve((resul = 2));
          }
        } else {
          resul = 3;
          resolve(resul);
        }
      });
    });
  }

  /** La funcion autenticarUsuario se encarga de autenticar el usuario para poder
    iniciar sesion */
  static async autenticarUsuario(token) {
    return new Promise((resolve) => {
      conexion.query(usuarioAutenticado(token), function (error, resultado) {
        if (resultado.length != 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /** La funcion cambiarClaveUsuario, cambia la clave desde una clave antigua */
  static async cambiarClaveUsuario(correo, clave) {
    return new Promise((resolve) => {
      conexion.query(
        cambioClaveUsuario(correo, clave),
        function (error, resultado) {
          if (resultado.length != 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  /** La funcion guardarTokenCambioClave registra un token para que el usuario
    cambie su clave */
  static async guardarTokenCambioClave(correo, token) {
    return new Promise((resolve) => {
      conexion.query(saveTokenCambioClave(correo, token),function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /** La funcion claveSeCambio cambia la clave en la bd despues de validar el
    token */
  static async claveSeCambio(correo, clave){
    return new Promise((resolve) => {
      conexion.query(cambioClaveUsuario(correo, clave),function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
