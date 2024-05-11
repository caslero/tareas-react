import { TareaModelo } from "../Model/TareaModelo.js";
import { LoginModelo } from "../Model/LoginModelo.js";
import { UsuarioModelo } from "../Model/UsuarioModelo.js";
import { cookieDecodificada, validarCamposTareas, } from "../validaciones/TareaValidar.js";
import bcryptjs from "bcryptjs";

export class TareaControlador {
  /** La funcion usuarioActivo nos trae el nombre del usuario que se loggueo, 
    esto analizando el token almacenado en el navegador */
  static async usuarioActivo(req, res) {
    const cookie = cookieDecodificada(req);
    const estatus = cookie.status;
    const correo = cookie.correo;
    let nombre = "";

    if (estatus === "error") {
      res.send({
        status: cookie.status,
        numero: cookie.numero,
        message: cookie.message,
      });
    } else {
      const resultado = await TareaModelo.nombreUsuarioActivo(correo);
      nombre = resultado[0].nombre;
      res.send({
        status: "ok",
        numero: 1,
        message: nombre,
      });
    }
  }

  /** La funcion cambiarClave cambia la clave desde una clave anterior*/
  static async cambiarClave(req, res) {
    const claveVieja = req.body.claveVieja;
    const claveNueva = req.body.claveNueva;

    const respuestaCookie = cookieDecodificada(req);
    if (respuestaCookie.status === "ok") {
      const correo = respuestaCookie.correo;
      const claveGuardada = await LoginModelo.claveUsuario(correo);
      const clave = claveGuardada[0].clave;
      const comparada = await bcryptjs.compare(claveVieja, clave);
      if (comparada) {
        const respuesta = validarCamposTareas(req);
        if (respuesta) {
          res.send({
            status: respuesta.status,
            numero: respuesta.numero,
            message: respuesta.message,
          });
        } else {
          const encriptado = await bcryptjs.genSalt(5);
          const claveEncriptada = await bcryptjs.hash(claveNueva, encriptado);

          const claveCambiar = await UsuarioModelo.cambiarClaveUsuario(
            correo,
            claveEncriptada
          );

          if (claveCambiar) {
            res.send({
              status: "ok",
              numero: 1,
              message: "Cambio de clave exitoso",
              redirect: "/tareas",
            });
          } else {
            res.send({
              status: "error",
              numero: 0,
              message: "Fallo al cambiar clave",
            });
          }
        }
      }
    } else {
      res.send({
        status: respuestaCookie.status,
        numero: respuestaCookie.numero,
        message: respuestaCookie.message,
      });
    }
  }

  static async guardarTarea(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;
      const { tarea } = req.body;

      if (!tarea) {
        res.send({
          status: "error",
          numero: 0,
          message: "Tarea vacia",
        });
      } else {
        const tareaGuardada = await TareaModelo.guardarTarea(correo, tarea);
        if (tareaGuardada) {
          res.send({
            status: "ok",
            numero: 1,
            message: "Guardada con exito",
          });
        }
      }
    } catch (error) {
      console.log("Error, al guardar tarea: " + error);
    }
  }

  static async tareasAscendentes(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;

      const tareasAsc = await TareaModelo.tareasAscendentes(correo);
      if (tareasAsc) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Ascendentes",
          tareas: tareasAsc,
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "No hay tareas",
        });
      }
    } catch (error) {
      console.log("Error, tareasAscendentes: " + error);
    }
  }

  static async tareasDescendentes(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;

      const tareasDesc = await TareaModelo.tareasDescendentes(correo);
      if (tareasDesc) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Descendentes",
          tareas: tareasDesc,
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "No hay tareas",
        });
      }
    } catch (error) {
      console.log("Error, tareasDescendentes: " + error);
    }
  }

  static async estadoTarea(req, res) {
    try {
      let nuevoEstado = "";
      const { id, estado } = req.body;

      if (estado == "desmarcada") {
        nuevoEstado = "marcada";
        const updateEstado = await TareaModelo.actualizarEstado(
          id,
          nuevoEstado
        );
        res.send({
          status: "ok",
          numero: 1,
          message: "Actualizado",
          respuesta: updateEstado,
        });
      } else {
        nuevoEstado = "desmarcada";
        const updateEstado = await TareaModelo.actualizarEstado(
          id,
          nuevoEstado
        );
        res.send({
          status: "ok",
          numero: 1,
          message: "Actualizado",
          respuesta: updateEstado,
        });
      }
    } catch (error) {
      console.log("Error, estadoTarea: " + error);
    }
  }

  static async actualizarTarea(req, res) {
    try {
      const { id, tarea } = req.body;
      const updateTareas = await TareaModelo.updateTarea(id, tarea);
      if (updateTareas) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Tarea actualizada",
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "No se cambio la tarea",
        });
      }
    } catch (error) {
      console.log("Error, actualizarTarea: " + error);
    }
  }

  static async borrarTareaIndividual(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;
      const { id } = req.params;
      const eliminarUnaTarea = await TareaModelo.deleteTareaIndividual(
        id,
        correo
      );
      if (eliminarUnaTarea) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Tarea eliminada",
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "Tarea no eliminada",
        });
      }
    } catch (error) {
      console.log("Error, borrando una tarea: " + error);
    }
  }

  static async borrarTareasMarcadas(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;
      const eliminarTareasMarcadas = await TareaModelo.deleteTareasMarcadas(
        correo
      );

      if (eliminarTareasMarcadas) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Tareas marcadas eliminadas",
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "Tareas marcadas no eliminadas",
        });
      }
    } catch (error) {
      console.log("Error, borrando tareas marcadas: " + error);
    }
  }

  static async borrarTareasTodas(req, res) {
    try {
      const cookie = cookieDecodificada(req);
      const correo = cookie.correo;

      const eliminarTareasTodas = await TareaModelo.deleteTareasTodas(correo);
      if (eliminarTareasTodas) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Tareas eliminadas",
        });
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "Tareas no eliminadas",
        });
      }
    } catch (error) {
      console.log("Error borrar todas las tareas: " + error);
    }
  }
}
