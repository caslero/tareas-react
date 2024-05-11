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
import axios from "axios";

export function Login() {
  const urlUsuarioLogin = "login";

  const iniciarSesion = async (correo, clave) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        correo,
        clave,
        urlUsuarioLogin,
      });
      const { token } = response.data;
      document.cookie = `jwt=${token}; path=/; `;
      mostrarMsjValidacion(response.data, urlUsuarioLogin);
    } catch (error) {
      console.log("Error en sesion, Login.jsx: " + error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correo = e.target.correo.value;
    const clave = e.target.clave.value;
    iniciarSesion(correo, clave);
  };

  return (
    <section className="w-full xl:px-28 flex flex-col items-center">
      <TituloPaginas nombreClase={"titulo-usuario-login"} nombre={"Login"} />
      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-[600px] px-4 pt-5"
      >
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
          <CuadroValidar />
        </div>
        <div className="flex justify-between">
          <LinkPaginas
            nombreClase={"a-link-usuario-login"}
            direccion={"/registro"}
            nombre={"Registro"}
          />
          <LinkPaginas
            nombreClase={"a-link-usuario-login"}
            direccion={"/cambiar-clave"}
            nombre={"Olvido su clave?"}
          />
        </div>
        <div>
          <BotonPaginas
            nombreClase={"btn-usuario-login"}
            tipo={"submit"}
            nombre={"Iniciar sesion"}
          />
        </div>
      </form>
    </section>
  );
}
