import { conexion } from "../db/conexion.js";
import { nombreUsuario, tareaGuardada, ascendentesTareas, descendentesTareas, updateEstado, actualizarTarea, eliminarUnaTarea, eliminarTareasMarcadas, eliminarTareasTodas, } from "../sql/TareaSentencia.js";

export class TareaModelo {
  /** La funcion nombreUsuarioActivo trae el nombre del usuario que se loggueo */
  static async nombreUsuarioActivo(correo) {
    return new Promise((resolve) => {
      conexion.query(nombreUsuario(correo), function (error, resultado) {
        if (resultado.length != 0) {
          resolve(resultado);
        } else {
          resolve(resultado);
        }
      });
    });
  }

  static async guardarTarea(correo, tarea) {
    return new Promise((resolve) => {
      conexion.query(tareaGuardada(correo, tarea), function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  static async tareasAscendentes(correo) {
    return new Promise((resolve) => {
      conexion.query(ascendentesTareas(correo), function (error, resultado) {
        if (!error) {
          resolve(resultado);
        } else {
          resolve(resultado);
        }
      });
    });
  }

  static async tareasDescendentes(correo) {
    return new Promise((resolve) => {
      conexion.query(descendentesTareas(correo), function (error, resultado) {
        if (!error) {
          resolve(resultado);
        } else {
          resolve(resultado);
        }
      });
    });
  }

  static async actualizarEstado(id, nuevoEstado) {
    return new Promise((resolve) => {
      conexion.query(
        updateEstado(id, nuevoEstado),
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

  static async updateTarea(id, tarea) {
    return new Promise((resolve) => {
      conexion.query(actualizarTarea(id, tarea), function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  static async deleteTareaIndividual(id, correo) {
    return new Promise((resolve) => {
      conexion.query(eliminarUnaTarea(id, correo), function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  static async deleteTareasMarcadas(correo) {
    return new Promise((resolve) => {
      conexion.query(
        eliminarTareasMarcadas(correo),
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

  static async deleteTareasTodas(correo) {
    return new Promise((resolve) => {
      conexion.query(eliminarTareasTodas(correo), function (error, resultado) {
        if (!error) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
