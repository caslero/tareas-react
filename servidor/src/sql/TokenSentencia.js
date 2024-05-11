/** Todas estas funciones representan las sentencias SQL que se utilizan en
    TokenModelo.js */

/** La funcion existeUsuario trae el usuario si existe o no */
export function existeToken(token) {
  const tokenExiste = `SELECT IF((SELECT COUNT(*) FROM tokens WHERE token = '${token}' AND utilizado = 'false') > 0, 1, 0) AS tokenExiste`;
  return tokenExiste;
}

/** La funcion correoExiste trae los campos correo, utilizado, vencido */
export function correoExiste(token) {
  let tokenCambioClave = `SELECT correo, utilizado, vencido FROM tokens WHERE token = '${token}'`;
  return tokenCambioClave;
}

/** La funcion tokenVencido actualiza el token si se utilizo */
export function tokenVencido(token) {
  let vencioToken = `UPDATE tokens SET utilizado = 'true', futilizado = NOW() WHERE token = '${token}'`;
  return vencioToken;
}

/** La funcion tokenValido se encarga de mostrarnos el token valido */
export function tokenValido(correo) {
  let ultimoToken = `SELECT * FROM tokens WHERE correo = '${correo}'`;
  return ultimoToken;
}

/** La funcion desactivarTokenVencido, coloca la fecha de cuando se vencio
    el token */
export function desactivarTokenVencido(correo, id) {
    let vencioToken = `UPDATE tokens SET vencido = 'true', fvencido = CASE WHEN fvencido = '0000-00-00 00:00:00' THEN NOW() ELSE fvencido END WHERE correo = '${correo}' AND id != ${id} AND fvencido = '0000-00-00 00:00:00'`;
    return vencioToken;
}
