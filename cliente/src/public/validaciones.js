let respuesta = "";
/** La funcion mostrarMsjValidacion(data) se encargara de mostrar un msj al usuario
  de lo que ocurre al guardar un usuario o iniciar sesion, entre otros */
export async function mostrarMsjValidacion(data, urlUsuarioLogin) {
  const msjValidacion = document.getElementById("validar");
  const url = urlUsuarioLogin;
  const estatus = data.status;
  const respuesta = data.message;
  if (estatus === "error") {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
  } else if (estatus === "ok") {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
    setTimeout(() => {
      msjValidacion.classList.remove("mostrarMsjValidacion");
      msjValidacion.classList.add("ocultarMsjValidacion");
      window.location.href = data.redirect;
    }, 4000);
  }
  setTimeout(() => {
    msjValidacion.classList.remove("mostrarMsjValidacion");
    msjValidacion.classList.add("ocultarMsjValidacion");
    if (url === "usuario") {
      document.getElementById("nombre").value = "";
      document.getElementById("correo").value = "";
      document.getElementById("clave").value = "";
      document.getElementById("clave2").value = "";
    } else if (url === "login") {
      document.getElementById("correo").value = "";
      document.getElementById("clave").value = "";
    }
  }, 4000);
}

/** La funcion validarTareas se encarga de mostrar un msj desde el back-end, 
  para mostrar el nombre del usuario o algun error */
export function validarTareas(data) {
  const datos = data;
  respuesta = {
    status: datos.data.status,
    numero: datos.data.numero,
    message: datos.data.message,
  };
  return respuesta;
}

/** La funcion msjValidacionTareas se encarga de mostrar los msj, cuando se
  esta haciendo el cambio de clave */
export function msjValidacionTareas(data) {
  const msjValidacion = document.getElementById("validar");
  const respuesta = data.message;

  if (respuesta === "Cambio de clave exitoso") {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
    window.location.href = data.redirect;
  } else {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
  }

  setTimeout(() => {
    msjValidacion.classList.remove("mostrarMsjValidacion");
    msjValidacion.classList.add("ocultarMsjValidacion");

    document.getElementById("claveVieja").value = "";
    document.getElementById("claveNueva").value = "";
    document.getElementById("claveNueva2").value = "";
  }, 4000);
}

/** La funcion msjCambioClaveToken se encarga de mostrar los msj, cuando se
  esta enviando el correo para el cambio de clave */
export function msjCambioClaveToken(data) {
  const msjValidacion = document.getElementById("validar");
  const estatus = data.status;
  const respuesta = data.message;

  if (estatus === "ok") {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
    setTimeout(() => {
      window.location.href = data.redirect;
    }, 4000);
  } else {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
  }
  setTimeout(() => {
    msjValidacion.classList.remove("mostrarMsjValidacion");
    msjValidacion.classList.add("ocultarMsjValidacion");
    document.getElementById("correo").value = "";
  }, 4000);
}
