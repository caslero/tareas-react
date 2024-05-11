/** Todas estas funciones representan las sentencias SQL que se utilizan en
    LoginModelo.js */

/** La funcion existeUsuario trae el usuario si existe o no */
export function existeUsuario(correo) {
    const usuarioExiste = `SELECT IF((SELECT COUNT(*) FROM usuario WHERE correo = '${correo}') > 0, 1, 0) AS usuarioExiste`;
    return usuarioExiste;
}

/** La funcion usuarioAutenticado se encarga de verificar el usuario */
export function usuarioAutenticado(correo) {
    let authUsuario = `SELECT autenticar FROM usuario WHERE correo = '${correo}'`
    return authUsuario;
}

/** La funcion usuarioAutenticado se encarga de verificar el usuario */
export function claveGuardadaUsuario(correo) {
    let claveUsuario = `SELECT clave FROM usuario WHERE correo = '${correo}'`
    return claveUsuario;
}

/** La funcion tokenAutenticarUsuario se encarga de traernos el token de auth */
export function tokenAutenticarUsuario(correo) {
    let tokenUsuario = `SELECT token FROM usuario WHERE correo = '${correo}'`
    return tokenUsuario;
}
