import { UsuarioModelo } from "../Model/UsuarioModelo.js";
import {
  validarCampos,
  tokenValidarUsuario,
} from "../validaciones/UsuarioValidar.js";
import {
  sendMail,
  sendMailCambiarClave,
} from "../validaciones/UsuarioValidar.js";
import bcryptjs from "bcryptjs";
import { vCorreoCambiarClave } from "../validaciones/LoginValidar.js";
import { TareaModelo } from "../Model/TareaModelo.js";

/** La clase UsuarioControlador se encarga de los procesos que hace el usuario */
export class UsuarioControlador {
  /** guardarUsuarios se encarga de guardar un nuevo usuario en caso de
    cumplirse todas las condiciones */
  static async guardarUsuarios(req, res) {
    try {
      const nombre = req.body.nombre;
      const correo = req.body.correo;
      const clave = req.body.clave;

      const respuesta = validarCampos(req, res);

      if (respuesta) {
        return res.status(400).send({
          status: respuesta.status,
          numero: respuesta.numero,
          message: respuesta.message,
        });
      } else {
        const usuarioExiste = await UsuarioModelo.existeUsuario(correo);
        if (!usuarioExiste.length != 0) {
          const token = tokenValidarUsuario(10);
          const encriptado = await bcryptjs.genSalt(5);
          const claveEncriptada = await bcryptjs.hash(clave, encriptado);

          const resultado = await UsuarioModelo.registrarNuevoUsuario(
            nombre,
            correo,
            claveEncriptada,
            token
          );
          if (resultado) {
            sendMail(correo, nombre, token);
            return res.status(201).send({
              status: "ok",
              numero: 1,
              message: "Registro exitoso",
              redirect: "/login",
            });
          }
        } else {
          return res.status(400).send({
            status: "error",
            numero: 0,
            message: "Usuario ya existe",
          });
        }
      }
    } catch (error) {
      console.log("Error al guardar usuario: " + error);
    }
  }

  /** La funcion autenticarUsuario se encarga de autenticar el usuario mediante el
    token que se envio al correo y guarda la fecha cuando se autentico */
  static async autenticarUsuario(req, res) {
    try {
      const tokenAuth = req.body.token;

      if (tokenAuth.length != 16) {
        return res.status(400).send({
          status: "error",
          numero: 0,
          message: "Token invalido",
        });
      } else {
        const autenticado = await UsuarioModelo.estaAutenticado(tokenAuth);
        if (autenticado === 1) {
          res.send({
            status: "ok",
            numero: 1,
            message: "Usuario ya esta autenticado",
          });
        } else if (autenticado === 2) {
          const tokenValidado = await UsuarioModelo.autenticarUsuario(
            tokenAuth
          );
          if (tokenValidado) {
            res.send({
              status: "ok",
              numero: 1,
              message: "Autenticado con exito",
            });
          }
        } else {
          res.send({
            status: "error",
            numero: 0,
            message: "Fallo al autenticar",
          });
        }
      }
    } catch (error) {
      console.log("Error token invalido: " + error);
      return res.status(400).send({
        status: "error",
        numero: 0,
        message: "Token invalido",
      });
    }
  }

  /** La funcion cambioClaveToken guarda un token para qeu el usuario cambie su
    clave mediante un enlace por correo electronico */
  static async cambioClaveToken(req, res) {
    const correo = req.body.correo;

    const respuest = vCorreoCambiarClave(req);
    if (respuest) {
      res.send({
        status: respuest.status,
        numero: respuest.numero,
        message: respuest.message,
      });
    } else {
      const token = tokenValidarUsuario(10);
      const usuarioExiste = await UsuarioModelo.existeUsuario(correo);
      if (usuarioExiste != 0) {
        const tokenEnviado = await UsuarioModelo.guardarTokenCambioClave(
          correo,
          token
        );

        if (tokenEnviado) {
          const nombreUsuario = await TareaModelo.nombreUsuarioActivo(correo);
          const nombre = nombreUsuario[0].nombre;

          sendMailCambiarClave(correo, nombre, token);
          res.send({
            status: "ok",
            numero: 1,
            message: "Revise su correo",
            redirect: "/login",
          });
        } else {
          res.send({
            status: "error",
            numero: 0,
            message: "No se envio el token. Intente de nuevo",
          });
        }
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "Correo no existe",
        });
      }
    }
  }
}
