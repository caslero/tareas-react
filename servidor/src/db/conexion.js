import { createConnection } from 'mysql';
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });


/** conexion es la ercargada de hacer la conexion a la BD */
export const conexion = createConnection({
    host: process.env.SERVIDOR,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    database: process.env.todolist
});

/** conexion.connect se encarga de mostrar si se conecta o si ocurre un error */
conexion.connect((error) => {
    if (error) {
        console.log('Error al conectar: ' + error);
    } else {
        console.log('Conexion exitosa...');
    }
})
