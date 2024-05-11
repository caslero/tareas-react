/** Todas estas funciones representan las sentencias SQL que se utilizan en
    UsuarioModelo.js */

/** La funcion guardarUsuario se encarga de registrar un usuario */
export function guardarUsuario(nombre, correo, clave, token, valido) {
  let registrarUsuario = `INSERT INTO usuario(nombre, correo, clave, token, autenticar, fregistro) VALUES ('${nombre}', '${correo}', '${clave}', '${token}', '${valido}', NOW())`;
  return registrarUsuario;
}

/** La funcion usuarioExiste se encarga de traernos el nombre de usuario en caso
    de que el usuario exista */
export function usuarioExiste(correo) {
  let existeElUsuario = `SELECT nombre FROM usuario WHERE correo = '${correo}'`;
  return existeElUsuario;
}

/** La funcion usuarioYaAutenticado se encarga de que si el usuario esta autenticado
    no actualice nada y en caso contrario autentique el usuario y guarde la fecha
    en que se autentico */
export function usuarioYaAutenticado(token) {
  let estaAutenticado = `SELECT autenticar FROM usuario WHERE token = '${token}'`;
  return estaAutenticado;
}

/** La funcion usuarioAutenticado se encarga de autenticar el usuario para poder
    iniciar sesion y guardar la fecha en la que se autentico */
export function usuarioAutenticado(token) {
  let authUsuario = `UPDATE usuario SET autenticar = 'true', fvalidado = NOW() WHERE token = '${token}'`;
  return authUsuario;
}

/** La funcion cambioClaveUsuario cambia la clave desde una clave existente */
export function cambioClaveUsuario(correo, clave) {
  let cambioClave = `UPDATE usuario SET clave = '${clave}' WHERE correo = '${correo}'`;
  return cambioClave;
}

/** La funcion saveTokenCambioClave guarda un token solicitado para el cambio
  de clave */
export function saveTokenCambioClave(correo, token) {
  let guardarTokenCambioClave = `INSERT INTO tokens(token, correo, utilizado, fsolicitud, vencido) VALUES ('${token}', '${correo}', 'false', NOW(), 'false')`;
  return guardarTokenCambioClave;
}





















// /** La funcion usuarioEstaValidado se encarga de traernos el autenticar de
//     usuario en caso de que el usuario exista */
// export function usuarioEstaValidado(correo) {
//   let usuarioValidado = `SELECT autenticar FROM usuario WHERE correo = '${correo}'`;
//   return usuarioValidado;
// }

// /** La funcion verClave consulta la BD, extrae la clave del usuario, esto con
//     la finalidad de cambiar la clave desde una clave ya existente */
// export function verClave(correo) {
//   let mostrarClave = `SELECT clave FROM usuario WHERE correo = '${correo}'`;
//   return mostrarClave;
// }

// /** La funcion updateClave se encarga de cambiar la clave */
// export function updateClave(clave, correo) {
//   let actualizarClave = `UPDATE usuario SET clave = '${clave}' WHERE correo = '${correo}'`;
//   return actualizarClave;
// }

// /** La funcion obtenerIdUsuario se encarga de traenos un id de un usuario X */
// export function obtenerIdUsuario(correo) {
//   let idUsuario = `SELECT id FROM usuario WHERE correo = '${correo}'`;
//   return idUsuario;
// }

// /** La funcion guardarTokenCambioClaves se encarga de guardar un token para cambiar
//     la clave mediante un link, en la tabla se guarda un id, id_usuario y el token */
// export function guardarTokenCambioClaves(id, validarUsuario) {
//   let guardarTokenCambioClave = `INSERT INTO tokens (id_usuario, token) VALUES ('${id}', '${validarUsuario}')`;
//   return guardarTokenCambioClave;
// }
