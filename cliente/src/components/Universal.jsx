import tareas from "../public/img/tareas.png";
import { ImagenIndex, TituloApp } from "./Index";
import "../public/css/index.css";

export function MaquetadoApp() {
  return (
    <section className="container mx-auto xl:px-28 px-4 pt-10 w-screen h-[500px] flex items-center justify-center">
      <div className="space-y-4 flex flex-col items-center w-full max-w-[500px] h-full">
        <TituloApp nombreClase={"titulo-index"} />
        <ImagenIndex srcc={tareas} />
        <div className="flex justify-between w-full">
          <LinkPaginas
            direccion="/registro"
            nombreClase="btn-index"
            nombre={"Registrar Usuario"}
          />
          <LinkPaginas
            direccion="/login"
            nombreClase="btn-index"
            nombre={"Login"}
          />
        </div>
      </div>
    </section>
  );
}

export function TituloPaginas({ nombre, nombreClase, ide }) {
  return (
    <h3 className={nombreClase} id={ide}>
      {nombre}
    </h3>
  );
}

export function BotonPaginas({ nombre, nombreClase, tipo, funcion }) {
  return (
    <button className={nombreClase} type={tipo} onClick={funcion}>
      {nombre}
    </button>
  );
}

export function LinkPaginas({ direccion, nombreClase, nombre }) {
  return (
    <a href={direccion} className={nombreClase}>
      {nombre}
    </a>
  );
}

export function NombreRegistroLogin({ nombreClase, nombre }) {
  return <p className={nombreClase}>{nombre}</p>;
}

export function InputRegistroLogin({
  nombreClase,
  ide,
  nombreInput,
  tipo,
  placeholderInput,
}) {
  return (
    <div className="w-full mb-4 border-2 border-[#493b27] flex items-center justify-center bg-white rounded-[5px] hover:border-2 hover:border-[#8f7ad7] transition-all ease-in duration-[300ms]">
      <input
        className={nombreClase}
        id={ide}
        name={nombreInput}
        type={tipo}
        placeholder={placeholderInput}
      />
    </div>
  );
}

export function CuadroValidar({ mensaje }) {
  return (
    <div
      id="validar"
      className="ocultar-validacion ocultarMsjValidacion w-full border-2 border-[#493b27]bg-white rounded-[5px] hover:border-[#8f7ad7] transition-all ease-in duration-[300ms]"
    >
      {mensaje}
    </div>
  );
}
