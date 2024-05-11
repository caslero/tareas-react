import {
  NombreRegistroLogin,
  InputRegistroLogin,
  TituloPaginas,
  BotonPaginas,
  CuadroValidar,
  LinkPaginas,
} from "./Universal.jsx";
import { msjCambioClaveToken } from "../public/validaciones.js";
import "../public/css/universal.css";
import axios from "axios";

export function EnviarCorreoCambioClaveToken() {
  const correoCambioClave = async (correo) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        "http://localhost:8000/cambio-clave-token",
        {
          correo,
        }
      );
      msjCambioClaveToken(response.data);
    } catch (error) {
      console.log("Error. CambiarClaveToken.jsx: " + error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correo = e.target.correo.value;
    correoCambioClave(correo);
  };

  return (
    <section className="w-full xl:px-28 flex flex-col items-center">
      <TituloPaginas
        nombreClase={"titulo-usuario-login"}
        nombre={"Cambiar clave"}
      />
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
            direccion={"/login"}
            nombre={"Login"}
          />
        </div>
        <div>
          <BotonPaginas
            nombreClase={"btn-usuario-login"}
            tipo={"submit"}
            nombre={"Enviar"}
          />
        </div>
      </form>
    </section>
  );
}
