import express from "express";
import cors from "cors";
import { rutas } from "./routers/rutas.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(rutas);

//Corriendo el servidor
const PUERTO = process.env.PUERTO;
const PORT = PUERTO || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${PORT}...`);
});
