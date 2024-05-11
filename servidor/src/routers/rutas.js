import { Router } from "express";
import { UsuarioControlador } from "../Controller/UsuarioController.js";
import { LoginControlador } from "../Controller/LoginController.js";
import { TareaControlador } from "../Controller/TareaController.js";
import { UsuarioMiddleware } from "../middleware/UsuarioMiddleware.js";

export const rutas = Router();

rutas.post("/api/registro", UsuarioControlador.guardarUsuarios);
rutas.post("/validar/token", UsuarioControlador.autenticarUsuario);
rutas.post("/api/login", LoginControlador.iniciarSesion);
rutas.post("/usuario-activo", TareaControlador.usuarioActivo);
rutas.post("/cambiar-clave", TareaControlador.cambiarClave);
rutas.post("/cambio-clave-token", UsuarioControlador.cambioClaveToken);
rutas.post("/token-cambio-clave", UsuarioMiddleware.cambiandoClave);
rutas.post("/guardar-tarea", TareaControlador.guardarTarea);

rutas.get("/cerrar-sesion", LoginControlador.cerrarSesion);
rutas.get("/tareas-ascendentes", TareaControlador.tareasAscendentes);
rutas.get("/tareas-descendentes", TareaControlador.tareasDescendentes);

rutas.put("/tareas/actualizar-estado/:id", TareaControlador.estadoTarea);
rutas.put("/tareas/actualizar-tarea/:id", TareaControlador.actualizarTarea);

rutas.delete("/tareas/borrar-tarea-individual/:id", TareaControlador.borrarTareaIndividual);
rutas.delete("/tareas/borrar-tareas-marcadas", TareaControlador.borrarTareasMarcadas);
rutas.delete("/tareas/borrar-tareas-todas", TareaControlador.borrarTareasTodas);
