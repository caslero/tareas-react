import { useParams } from "react-router-dom";
import {
  TituloPaginas,
  NombreRegistroLogin,
  InputRegistroLogin,
  CuadroValidar,
  BotonPaginas,
} from "./Universal.jsx";
import "../public/css/universal.css";
import axios from "axios";

export function CambioClave() {
  const { token } = useParams();

  const data = cambioClave(token);

  data.then((resultado) => {
    const datos = resultado.data;
    if (datos.status === "ok") {
      document.getElementById("titulo").innerText = `Cambiar clave`;

      document.getElementById("cambioClave").classList.remove("hidden");
      document.getElementById("cambioClave").classList.add("flex");
    } else {
      document.getElementById("titulo").innerText = `${datos.message}`;

      document.getElementById("cambioClave").classList.remove("flex");
      document.getElementById("cambioClave").classList.add("hidden");

      setTimeout(() => {
        window.close();
      }, 4000);
    }
  });

  const claveCambiadas = async (claveNueva, claveNueva2) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        "http://localhost:8000/token-cambio-clave",
        {
          token,
          claveNueva,
          claveNueva2,
        }
      );
      msjCambioClaveToken(response.data);
    } catch (error) {
      console.log("Error en sesion, Login.jsx: " + error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const claveNueva = e.target.claveNueva.value;
    const claveNueva2 = e.target.claveNueva2.value;
    claveCambiadas(claveNueva, claveNueva2);
  };

  return (
    <section className="w-full xl:px-28 flex flex-col items-center">
      <div className="w-[80%] container mx-auto px-4 sm:px-0">
        <TituloPaginas
          nombreClase={"titulo-usuario-login"}
          nombre={""}
          ide={"titulo"}
        />
        <div id="cambioClave" className="flex flex-col">
          <form
            onSubmit={handleSubmit}
            className="container mx-auto max-w-[600px] px-4 pt-5"
          >
            <div>
              <NombreRegistroLogin
                nombreClase={"subtitulo-estilo"}
                nombre={"Nueva clave"}
              />
              <InputRegistroLogin
                nombreClase={"input-estilo"}
                ide={"claveNueva"}
                nombreInput={"claveNueva"}
                tipo={"text"}
                placeholderInput={"****************"}
              />
            </div>
            <div>
              <NombreRegistroLogin
                nombreClase={"subtitulo-estilo"}
                nombre={"Corfirme nueva clave"}
              />
              <InputRegistroLogin
                nombreClase={"input-estilo"}
                ide={"claveNueva2"}
                nombreInput={"claveNueva2"}
                tipo={"text"}
                placeholderInput={"****************"}
              />
            </div>
            <div>
              <CuadroValidar />
            </div>
            <div>
              <BotonPaginas
                nombreClase={"btn-usuario-login"}
                tipo={"submit"}
                nombre={"Cambiar clave"}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/** La funcion autenticarUsuario se encarga de enviar el token para autenticarse */
async function cambioClave(token) {
  axios.defaults.withCredentials = true;
  try {
    const response = await axios.post(
      "http://localhost:8000/token-cambio-clave",
      {
        token,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

function msjCambioClaveToken(data) {
  const msjValidacion = document.getElementById("validar");
  const estatus = data.status;
  const respuesta = data.message;

  if (estatus === "ok") {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
    setTimeout(() => {
      window.close();
    }, 4000);
  } else {
    msjValidacion.classList.remove("ocultarMsjValidacion");
    msjValidacion.classList.add("mostrarMsjValidacion");
    msjValidacion.innerHTML = `${respuesta}`;
    setTimeout(() => {
      msjValidacion.classList.remove("mostrarMsjValidacion");
      msjValidacion.classList.add("ocultarMsjValidacion");
    }, 4000);
  }
}