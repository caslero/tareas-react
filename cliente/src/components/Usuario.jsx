import {
  NombreRegistroLogin,
  InputRegistroLogin,
  TituloPaginas,
  BotonPaginas,
  CuadroValidar,
  LinkPaginas,
} from "./Universal.jsx";
import { mostrarMsjValidacion } from "../public/validaciones.js";
import "../public/css/universal.css";

export function Usuario() {
  const urlUsuarioLogin = "usuario";
  const guardarUsuario = async (nombre, correo, clave, clave2) => {
    await fetch("http://localhost:8000/api/registro", {
      method: "POST",
      body: JSON.stringify({
        nombre,
        correo,
        clave,
        clave2,
        urlUsuarioLogin,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        mostrarMsjValidacion(data, urlUsuarioLogin);
      })
      .catch((err) => {
        console.log("Hola: " + err.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const correo = e.target.correo.value;
    const clave = e.target.clave.value;
    const clave2 = e.target.clave2.value;
    guardarUsuario(nombre, correo, clave, clave2);
  };

  return (
    <section className="w-full xl:px-28 flex flex-col items-center">
      <TituloPaginas
        nombreClase={"titulo-usuario-login"}
        nombre={"Registrar Usuario"}
      />
      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-[600px] px-4 pt-5"
      >
        <div>
          <NombreRegistroLogin
            nombreClase={"subtitulo-estilo"}
            nombre={"Nombre"}
          />
          <InputRegistroLogin
            nombreClase={"input-estilo"}
            ide={"nombre"}
            nombreInput={"nombre"}
            tipo={"text"}
            placeholderInput={"Nombre"}
          />
        </div>
        <div>
          <NombreRegistroLogin
            nombreClase={"subtitulo-estilo"}
            nombre={"Correo"}
          />
          <InputRegistroLogin
            nombreClase={"input-estilo"}
            ide={"correo"}
            nombreInput={"correo"}
            tipo={"email"}
            placeholderInput={"ejemplo@ejemplo.com"}
          />
        </div>
        <div>
          <NombreRegistroLogin
            nombreClase={"subtitulo-estilo"}
            nombre={"Clave"}
          />
          <InputRegistroLogin
            nombreClase={"input-estilo"}
            ide={"clave"}
            nombreInput={"clave"}
            tipo={"password"}
            placeholderInput={"Ejemplo-0000"}
          />
        </div>
        <div>
          <NombreRegistroLogin
            nombreClase={"subtitulo-estilo"}
            nombre={"Repita la clave"}
          />
          <InputRegistroLogin
            nombreClase={"input-estilo"}
            ide={"clave2"}
            nombreInput={"clave2"}
            tipo={"password"}
            placeholderInput={"Ejemplo-0000"}
          />
        </div>
        <div>
          <CuadroValidar />
        </div>
        <div className="flex justify-between">
          <LinkPaginas
            nombreClase={"a-link-usuario-login"}
            direccion={"/"}
            nombre={"Inicio"}
          />
          <LinkPaginas
            nombreClase={"a-link-usuario-login"}
            direccion={"/login"}
            nombre={"Login"}
          />
        </div>
        <div>
          <BotonPaginas
            nombreClase={"btn-usuario-login"}
            tipo={"submit"}
            nombre={"Registrar"}
          />
        </div>
      </form>
    </section>
  );
}
