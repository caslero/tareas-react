import { Routes, Route } from "react-router-dom";
import { Index } from "../components/Index.jsx";
import { Usuario } from "../components/Usuario.jsx";
import { Login } from "../components/Login.jsx";
import { Tareas } from "../components/Tareas.jsx";
import { AutenticarUsuario } from "../components/AutenticarUsuario.jsx";
import { EnviarCorreoCambioClaveToken } from "../components/CambiarClaveToken.jsx";
import { CambioClave } from "../components/CambioClave.jsx";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/registro" element={<Usuario />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tareas" element={<Tareas />} />
      <Route path="/validar/:token" element={<AutenticarUsuario />} />
      <Route path="/cambiar-clave" element={<EnviarCorreoCambioClaveToken />} />
      <Route path="/cambiar-clave-token/:token" element={<CambioClave />} />
    </Routes>
  );
}

export default Rutas;