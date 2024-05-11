import { useParams } from "react-router-dom";
import { TituloPaginas, BotonPaginas } from "./Universal.jsx";
import "../public/css/universal.css";
import axios from "axios";

/** AutenticarUsuario es el componente que muestra la autenticacion del usuario */
export function AutenticarUsuario() {
  const { token } = useParams();

  if (token.length != 16) {
    window.location.href = "/";
  } else {
    const data = autenticarUsuario(token);
    data
      .then((resultado) => {
        const datos = resultado.data;
        if (datos.status === "ok") {
          document.getElementById(
            "auth-usuario"
          ).innerText = `${datos.message}`;
        } else {
          document.getElementById(
            "auth-usuario"
          ).innerText = `${datos.message}`;
        }
      })
      .catch((error) => {
        console.log("Token invalido: " + error);
      });

    return (
      <section className="container mx-auto flex flex-col items-center px-4 md:px-0 h-60 space-y-10 md:space-y-20">
        <TituloPaginas
          nombreClase={"titulo-usuario-login"}
          ide={"auth-usuario"}
        />
        <BotonPaginas
          nombreClase={"btn-clave-validar"}
          nombre={"Salir"}
          funcion={salir}
        />
      </section>
    );
  }
}

/** La funcion autenticarUsuario se encarga de enviar el token para autenticarse */
async function autenticarUsuario(token) {
  axios.defaults.withCredentials = true;
  try {
    const response = await axios.post("http://localhost:8000/validar/token", {
      token,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

/** La funcion salir se encarga de cerrar la ventana luego de autenticarse */
function salir() {
  window.close();
}
