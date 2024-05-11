//import tareas from "../public/img/tareas.png";
import { MaquetadoApp } from "./Universal.jsx";

export function Index() {
  return <MaquetadoApp />;
}

export function ImagenIndex({ srcc }) {
  return (
    <img
      className="w-40 h-60 md:w-60 md:h-96"
      src={srcc}
      alt="imagen principal de la app"
    />
  );
}

export function TituloApp({ nombreClase }) {
  return <h1 className={nombreClase}>Lista De Tareas</h1>;
}