import { validarTareas } from "../public/validaciones.js";
import {
  CuadroValidar,
  InputRegistroLogin,
  TituloPaginas,
} from "./Universal.jsx";
import { msjValidacionTareas } from "../public/validaciones.js";
import tareas from "../public/img/tareas.png";
import axios from "axios";
import "../public/css/tareas.css";
import "../public/css/universal.css";

import React, { useState, useEffect, useRef } from "react";

/** La funcion Tareas es el componente de la vista de tareas */
export function Tareas() {
  nombreUsuarioActivo();
  return (
    <>
      <HeaderTarea />
      <MainTarea />
    </>
  );
}

/** La funcion nombreUsuarioActivo, consulta el nombre del usuario activo */
function nombreUsuarioActivo() {
  axios.defaults.withCredentials = true;
  const cookie = document.cookie;

  try {
    const response = axios.post("http://localhost:8000/usuario-activo", {
      cookie,
    });
    response
      .then((data) => {
        const nombre = validarTareas(data);
        if (nombre.status === "ok") {
          document.getElementById(
            "nombre-usuario"
          ).innerText = `${nombre.message}`;
        } else {
          document.getElementById("root").classList.add("hidden");
          document.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error en la response: " + error);
      });
  } catch (error) {
    console.error("Error, intentando consultar usuario: " + error);
  }
}

/** La funcion HeaderTarea es el componente para la cabecera de la vista
  de tareas */
function HeaderTarea() {
  return (
    <header className=" border-b-2 border-[#8f7ad7] w-full h-20">
      <div className="flex justify-between items-center container px-4 mx-auto">
        <img
          className="w-[80px] h-[80px] sm:w-20 sm:h-20"
          src={tareas}
          alt=""
        />
        <div className="flex space-x-4">
          <span
            className="text-lg text-[#8f7ad7] font-semibold tracking-[2px]"
            id="nombre-usuario"
          ></span>
          <MenuDrops />
        </div>
      </div>
    </header>
  );
}

function MainTarea() {
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [tareas, setTareas] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const itemsToDisplay = isFiltering ? filteredTasks : tareas;
  const currentItems = itemsToDisplay.slice(indexOfFirstItem, indexOfLastItem);

  if (
    currentPage > 1 &&
    currentPage > Math.ceil(tareas.length / itemsPerPage)
  ) {
    setCurrentPage(currentPage - 1);
  }

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (tareas.length != 0) {
      const filterResult = tareas.filter((task) =>
        task.tarea.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (searchTerm.length !== 0) {
        setIsFiltering(filterResult.length !== 0);
        setFilteredTasks(filterResult);
      } else {
        setIsFiltering(filterResult.length === 0);
        setFilteredTasks(currentItems);
      }
    }
  };

  const handleOpen1 = () => {
    if (open2) {
      obtenerTareasDescendentes();
    } else {
      obtenerTareasAscendentes();
    }
    setOpen2(!open2);
  };

  const handleInputChange = (event) => {
    setNuevaTarea(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    guardarTarea(nuevaTarea);
  };

  const cerrarBusqueda = () => {
    if (open) {
      setOpen(!open);
      setSearchTerm("");
      setFilteredTasks(tareas);
      setIsFiltering(false);
    }
  };

  const guardarTarea = async (tarea) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post("http://localhost:8000/guardar-tarea", { tarea });
      setNuevaTarea("");
      obtenerTareasDescendentes();
      setIsFiltering("");
      cerrarBusqueda();
    } catch (error) {
      console.log("Error, guardando tarea: " + error);
    }
  };

  const obtenerTareasAscendentes = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(
        "http://localhost:8000/tareas-ascendentes"
      );
      const tareasFiltradas = data.tareas.filter((tarea) => !tarea.completada);
      setTareas(tareasFiltradas);
    } catch (error) {
      console.log("Error al obtener las tareas descendentes: " + error);
    }
  };

  useEffect(() => {
    obtenerTareasAscendentes();
  }, []);

  const obtenerTareasDescendentes = async () => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get(
        "http://localhost:8000/tareas-descendentes"
      );
      const tareasFiltradas = data.tareas.filter((tarea) => !tarea.completada);
      setTareas(tareasFiltradas);
    } catch (error) {
      console.log("Error al obtener las tareas descendentes: " + error);
    }
  };

  useEffect(() => {
    obtenerTareasDescendentes();
  }, []);

  return (
    <main className="w-full">
      <section className="flex flex-col container p-4 mx-auto ">
        <Fecha />
        <GuardarTarea
          onSubmit={handleSubmit}
          value={nuevaTarea}
          onChange={handleInputChange}
          open={open}
          setOpen={setOpen}
          open2={open2}
          setOpen2={setOpen2}
          handleOpen1={handleOpen1}
          tareas={tareas}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
        />
        <CuadroTareas
          isFiltering={isFiltering}
          setIsFiltering={setIsFiltering}
          filteredTasks={filteredTasks}
          setFilteredTasks={setFilteredTasks}
          tareas={currentItems}
          setTareas={setTareas}
          cerrarBusqueda={cerrarBusqueda}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          indexOfLastItem={indexOfLastItem}
          indexOfFirstItem={indexOfFirstItem}
          todasTareas={tareas}
        />
      </section>
    </main>
  );
}

function OrdenTareas(props) {
  return (
    <div className="w-1/2">
      <button
        onClick={props.handleOpen1}
        className="border border-[#8f7ad7] w-full h-10 font-[500] text-[#8f7ad7] text-lg rounded-[5px] flex items-center justify-center"
      >
        {props.open2 ? "Descendentes" : "Ascendentes"}
      </button>
    </div>
  );
}

function GuardarTarea(props) {
  const handleOpen = () => {
    props.setOpen(!props.open);
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:justify-between w-[100%] mb-20 sm:space-x-5 h-24 sm:h-12">
      <FormularioGuardarTarea
        onSubmit={props.onSubmit}
        value={props.value}
        onChange={props.onChange}
      />
      <div className="w-[100%] sm:w-[40%] space-x-2 flex justify-between h-10">
        <Filtrar
          searchTerm={props.searchTerm}
          handleSearch={props.handleSearch}
          onClick={handleOpen}
          open={props.open}
          tareas={props.tareas}
        />
        <OrdenTareas handleOpen1={props.handleOpen1} open2={!props.open2} />
      </div>
    </div>
  );
}

function Filtrar(props) {
  return (
    <div className="border border-[#8f7ad7] w-1/2 h-10 rounded-[5px] flex items-center justify-center space-x-3 sm:me-2">
      <span className="font-[500] text-[#8f7ad7] text-lg">Filtrar</span>
      <button onClick={props.onClick}>
        {props.open ? (
          <div>
            <i className="font-semibold text-[#e44646] text-xl ri-arrow-up-s-line"></i>
          </div>
        ) : (
          <div>
            <i className="font-semibold text-[#8f7ad7] text-xl ri-arrow-down-s-line"></i>
          </div>
        )}
      </button>
      <MenuBusqueda
        open={props.open}
        tareas={props.tareas}
        searchTerm={props.searchTerm}
        handleSearch={props.handleSearch}
      />
    </div>
  );
}

function MenuBusqueda(props) {
  const dropdownRe = useRef(null);

  return (
    <div ref={dropdownRe} className="dropdown">
      {props.open ? (
        <ul className="menu-busqueda-tarea hover:bg-pink-100">
          <li className="menu-item">
            <input
              className="w-full h-10 rounded-[5px] outline-none border border-[#8f7ad7] placeholder:hover:text-[#8f7ad7] indent-2.5"
              type="text"
              placeholder={"Buscando tarea..."}
              value={props.searchTerm}
              onChange={props.handleSearch}
            />
          </li>
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
}

function CuadroTareas({
  tareas,
  setTareas,
  isFiltering,
  filteredTasks,
  setFilteredTasks,
  cerrarBusqueda,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  indexOfLastItem,
  todasTareas,
}) {
  const [tareaEditando, setTareaEditando] = useState(null);
  const [nuevoTextoTarea, setNuevoTextoTarea] = useState({});
  const [tareasMarcadas, setTareasMarcadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [mensajeModal, setMensajeModal] = useState("");

  useEffect(() => {
    const tareasMarcadasLocalStorage = JSON.parse(
      localStorage.getItem("tareasMarcadas")
    );
    if (tareasMarcadasLocalStorage) {
      setTareasMarcadas(tareasMarcadasLocalStorage);
    }
  }, []);

  const handleCheckboxChange = (event, tarea) => {
    const isChecked = event.target.checked;
    const tareaActualizada = { ...tarea, completada: isChecked };
    event.target.classList.toggle("marcada", isChecked);
    event.target.classList.toggle("desmarcada", !isChecked);
    if (isChecked) {
      setTareasMarcadas((prevTareasMarcadas) => [
        ...prevTareasMarcadas,
        tareaActualizada,
      ]);
    } else {
      setTareasMarcadas((prevTareasMarcadas) =>
        prevTareasMarcadas.filter((t) => t.id !== tareaActualizada.id)
      );
    }
    cerrarBusqueda();
    actualizarEstadoTarea(tareaActualizada);
    localStorage.setItem("tareasMarcadas", JSON.stringify(tareasMarcadas)); // <-- Mover esta línea al final del bloque
  };

  useEffect(() => {
    const tareasMarcadasLocalStorage = JSON.parse(
      localStorage.getItem("tareasMarcadas")
    );
    if (tareasMarcadasLocalStorage) {
      setTareasMarcadas(tareasMarcadasLocalStorage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tareasMarcadas", JSON.stringify(tareasMarcadas));
  }, [tareasMarcadas]);

  const handleEdit = (tarea) => {
    setTareaEditando((tareaEditando) =>
      tareaEditando === tarea.id ? null : tarea.id
    );
  };

  const actualizarEstadoTarea = async (tarea) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.put(
        `http://localhost:8000/tareas/actualizar-estado/${tarea.id}`,
        tarea
      );
      // Guardar el estado de completado en el almacenamiento local
      localStorage.setItem(`tarea-${tarea.id}-completada`, tarea.completada);
    } catch (error) {
      console.log("Error al actualizar la tarea: " + error);
    }
  };

  const actualizarTarea = async (tarea) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.put(
        `http://localhost:8000/tareas/actualizar-tarea/${tarea.id}`,
        tarea
      );
    } catch (error) {
      console.log("Error al actualizar la tarea: " + error);
    }
  };

  const updateTarea = async (tarea) => {
    try {
      const nuevoTexto = nuevoTextoTarea[tarea.id];
      const tareaActualizada = {
        ...tarea,
        tarea: nuevoTexto !== undefined ? nuevoTexto : tarea.tarea,
      };

      await actualizarTarea(tareaActualizada);
      setTareaEditando(null);

      // Actualizar el nombre de la tarea en el estado de tareas
      const tareasActualizadas = tareas.map((t) => {
        if (t.id === tarea.id) {
          return tareaActualizada;
        }
        return t;
      });

      // Restablecer el estado nuevoTextoTarea para la tarea editada
      setNuevoTextoTarea((prevState) => {
        const newState = { ...prevState };
        delete newState[tarea.id];
        return newState;
      });

      // Ordenar las tareas actualizadas por nombre
      tareasActualizadas.sort((a, b) => b.tarea.localeCompare(a.tarea));

      setTareas(tareasActualizadas);
      cerrarBusqueda();
    } catch (error) {
      console.log("Error al actualizar la tarea: " + error);
    }
  };

  const eliminarTarea = async (tarea) => {
    axios.defaults.withCredentials = true;
    try {
      await axios.delete(
        `http://localhost:8000/tareas/borrar-tarea-individual/${tarea.id}`
      );
    } catch (error) {
      console.log("Error al eliminar la tarea: " + error);
    }
  };

  const handleInputChange = (event, tarea) => {
    const value = event.target.value;
    setNuevoTextoTarea((prevState) => ({
      ...prevState,
      [tarea.id]: value,
    }));
  };

  const handleDelete = async (tarea) => {
    setTareaSeleccionada(tarea);
    setMensajeModal(`¿Eliminar la tarea "${tarea.tarea}"?`);
    setShowModal(true);
  };

  const handleDeleteMarcadas = async () => {
    setMensajeModal("¿Eliminar las tareas marcadas?");
    setShowModal(true);
  };

  const handleDeleteTodasTareas = async () => {
    setMensajeModal("¿Eliminar todas las tareas?");
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (tareaSeleccionada) {
      eliminarTarea(tareaSeleccionada);
      setTareas((prevTareas) =>
        prevTareas.filter((t) => t.id !== tareaSeleccionada.id)
      );
      setTareaSeleccionada(null);
    } else if (tareasMarcadas.length > 0) {
      eliminarTareasMarcadas();
      const tareasIds = tareasMarcadas.map((t) => t.id);
      setTareas((prevTareas) =>
        prevTareas.filter((t) => !tareasIds.includes(t.id))
      );
      setTareasMarcadas([]);
    } else {
      eliminarTodasTareas();
      setFilteredTasks([]);
      setTareasMarcadas([]);
      setTareas([]);
    }
    setShowModal(false); // Cerrar la ventana modal
    cerrarBusqueda();
  };

  const handleModalCancel = () => {
    setTareaSeleccionada(null);
    setShowModal(false); // Cerrar la ventana modal
  };

  const eliminarTareasMarcadas = async () => {
    axios.defaults.withCredentials = true;
    try {
      await axios.delete("http://localhost:8000/tareas/borrar-tareas-marcadas");
    } catch (error) {
      console.log("Error al eliminar las tareas marcadas: " + error);
    }
  };

  const eliminarTodasTareas = async () => {
    axios.defaults.withCredentials = true;
    try {
      await axios.delete("http://localhost:8000/tareas/borrar-tareas-todas");
    } catch (error) {
      console.log("Error al eliminar las tareas marcadas: " + error);
    }
  };

  return (
    <>
      {(tareas.length === 0
        ? tareas
        : isFiltering
        ? filteredTasks
        : tareas
      ).map((tarea) => (
        <div
          className="border border-[#8f7ad7] w-full rounded-md mb-3"
          key={tarea.id}
        >
          <div className="flex justify-between items-center p-2">
            <input
              className={tarea.estado}
              type="checkbox"
              checked={tarea.completada}
              onChange={(event) => handleCheckboxChange(event, tarea)}
            />
            <input
              type="text"
              defaultValue={tarea.tarea}
              readOnly={tareaEditando !== tarea.id}
              onChange={(event) => handleInputChange(event, tarea)}
              className="outline-none sm:w-2/3 rounded-md capitalize indent-2 transition-all ease-in delay-100"
            />
            <button
              className="border border-[#8f7ad7] hover:border-2 hover:font-semibold h-[40px] w-[40px] rounded-full transition-all ease-in delay-100"
              onClick={() => handleEdit(tarea)}
            >
              {tareaEditando === tarea.id ? (
                <i
                  onClick={() => updateTarea(tarea)}
                  className="text-[#8f7ad7] ri-edit-box-fill"
                ></i>
              ) : (
                <i className="text-[#8f7ad7] ri-pencil-line"></i>
              )}
            </button>
            <button
              onClick={() => handleDelete(tarea)}
              className="border border-[#8f7ad7] hover:border-2 hover:font-semibold h-[40px] w-[40px] rounded-full transition-all ease-in delay-100"
            >
              <i className="text-[#8f7ad7] ri-delete-bin-2-line"></i>
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-container">
          <div className="modal-background"></div>
          <div className="modal-confirmar space-y-4">
            <h2 className="text-2xl text-[#8f7ad7] font-semibold">
              Confirmar eliminación
            </h2>
            <p className="text-lg text-[#8f7ad7]">{mensajeModal}</p>
            <div className="w-full flex justify-between px-10 space-x-2">
              <button className="btn-paginas" onClick={handleModalConfirm}>
                Aceptar
              </button>
              <button className="btn-paginas" onClick={handleModalCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center space-y-2 items-center border border-[#8f7ad7] w-full rounded-md mt-10 h-28">
        <div className="flex justify-between items-center px-2 h-12 w-full">
          <div className="basis-1/3 h-[40px] flex items-center justify-center">
            {currentPage === 1 ? null : (
              <button
                className="btn-paginas"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            )}
          </div>
          {todasTareas.length != 0 ? (
            <span className="basis-1/3 h-[40px] flex items-center justify-center text-[#8f7ad7]">
              Página {currentPage}/
              {Math.ceil(todasTareas.length / itemsPerPage)}
            </span>
          ) : null}

          <div className="basis-1/3 h-[40px] flex items-center justify-center">
            {indexOfLastItem >= todasTareas.length ? null : (
              <button
                className="btn-paginas"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastItem >= todasTareas.length}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center px-2 h-12 w-full">
          <div className="basis-[40%] sm:basis-1/3">
            {tareas.length > 0 && (
              <button className="btn-paginas" onClick={handleDeleteTodasTareas}>
                Borrar todas
              </button>
            )}
          </div>
          <span className="basis-[20%] sm:basis-1/3 h-[40px] flex items-center justify-center text-[#8f7ad7]">
            {todasTareas.length} Tareas
          </span>
          <div className="basis-[40%] sm:basis-1/3">
            {tareasMarcadas.length > 0 && (
              <button className="btn-paginas" onClick={handleDeleteMarcadas}>
                Borrar marcadas
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FormularioGuardarTarea(props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className="w-full sm:w-[60%] flex items-center justify-between"
    >
      <input
        className="w-[85%] h-10 rounded-[5px] outline-none border border-[#8f7ad7] placeholder:hover:text-[#8f7ad7] indent-2.5 capitalize"
        type="text"
        placeholder={"Nueva Tarea"}
        value={props.value}
        onChange={props.onChange}
      />
      <button type="submit">
        <svg
          className="border border-[#8f7ad7] rounded-[5px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="#8f7ad7"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M4 3H18L20.7071 5.70711C20.8946 5.89464 21 6.149 21 6.41421V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM7 4V9H16V4H7ZM6 12V19H18V12H6ZM13 5H15V8H13V5Z"></path>
        </svg>
      </button>
    </form>
  );
}

function Fecha() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const formatDateTime = (date) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return date.toLocaleString("es-ES", options);
  };

  return (
    <div className="flex justify-between items-center">
      <TituloPaginas
        nombre={"Tareas"}
        nombreClase={"text-[#8f7ad7] text-2xl font-semibold"}
      />
      <span className="capitalize text-[13px] text-[#8f7ad7] font-semibold">
        {formatDateTime(currentDateTime)}
      </span>
    </div>
  );
}

/** La funcion cambioClave se encarga de enviar al back-end la clave vieja,
  la clave nueva y la clave de confimar */
async function cambioClave(claveVieja, claveNueva, claveNueva2) {
  axios.defaults.withCredentials = true;
  const cookie = document.cookie;
  try {
    const response = await axios.post("http://localhost:8000/cambiar-clave", {
      cookie,
      claveVieja,
      claveNueva,
      claveNueva2,
    });
    msjValidacionTareas(response.data);
  } catch (error) {
    console.log("Error en sesion. Tareas.jsx: " + error);
  }
}

/** La funcion MenuDrops contiene el formulario de cambio de clave y la
  funcion de enviar los datos para el cambio de clave, tambien otros
  componentes como la ventana modal y el boton salir */
function MenuDrops() {
  const [open, setOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOpen = () => {
    setOpen(!open);
  };

  const openPopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const cambiarClave = (e) => {
    e.preventDefault();
    const claveVieja = e.target.claveVieja.value;
    const claveNueva = e.target.claveNueva.value;
    const claveNueva2 = e.target.claveNueva2.value;
    cambioClave(claveVieja, claveNueva, claveNueva2);
  };

  return (
    <div ref={dropdownRef} className="dropdown">
      <button id="openClose" onClick={handleOpen}>
        {open ? (
          <div>
            <i className="font-semibold text-[#e44646] text-xl ri-arrow-up-s-line"></i>
          </div>
        ) : (
          <div>
            <i className="font-semibold text-[#8f7ad7] text-xl ri-arrow-down-s-line"></i>
          </div>
        )}
      </button>
      {open ? (
        <ul className="menu">
          <li className="menu-item">
            <button onClick={openPopup}>Cambiar clave</button>
            {isPopupOpen ? (
              <div className="modal-container">
                <div className="modal-background"></div>
                <div className="modal-content px-4">
                  <form onSubmit={cambiarClave}>
                    <InputRegistroLogin
                      nombreClase={"input-estilo "}
                      ide={"claveVieja"}
                      nombreInput={"claveVieja"}
                      tipo={"password"}
                      placeholderInput={"Ejemplo-0000"}
                    />
                    <InputRegistroLogin
                      nombreClase={"input-estilo "}
                      ide={"claveNueva"}
                      nombreInput={"claveNueva"}
                      tipo={"password"}
                      placeholderInput={"Ejemplo-0000"}
                    />
                    <InputRegistroLogin
                      nombreClase={"input-estilo "}
                      ide={"claveNueva2"}
                      nombreInput={"claveNueva2"}
                      tipo={"password"}
                      placeholderInput={"Ejemplo-0000"}
                    />
                    <CuadroValidar />
                    <div className="flex justify-between space-x-2">
                      <button className="btn-clave-validar">Aceptar</button>
                      <button className="btn-clave-validar" onClick={openPopup}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li className="menu-item">
            <button onClick={logOut}>Salir</button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

/** La funcion logOut se encarga de cerrar la sesion */
function logOut() {
  axios.defaults.withCredentials = true;
  try {
    const response = axios.get("http://localhost:8000/cerrar-sesion");
    response
      .then((data) => {
        if (data.data.message === "Cerrando sesion") {
          document.getElementById("root").classList.add("hidden");
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error en la response. Tareas.jsx: " + error);
      });
  } catch (error) {
    console.log("logOut. Tareas.jsx: " + error);
  }
}
