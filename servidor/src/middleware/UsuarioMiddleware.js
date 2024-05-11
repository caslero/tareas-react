import { TokenModelo } from "../Model/TokenModelo.js";
import { UsuarioModelo } from "../Model/UsuarioModelo.js";
import bcryptjs from "bcryptjs";

import { validarCamposNuevaClave } from "../validaciones/UsuarioValidar.js";

export class UsuarioMiddleware {
  static async cambiandoClave(req, res, next) {
    const tokenCambioClave = req.body.token;
    const claveNueva = req.body.claveNueva;
    const claveNueva2 = req.body.claveNueva2;

    try {
      const tokenExiste = await TokenModelo.validandoToken(tokenCambioClave);
      if (tokenExiste == 1) {
        const resultadoCorreo = await TokenModelo.correoTokenCambioClave(
          tokenCambioClave
        );
        const correo = resultadoCorreo[0].correo;
        const utilizado = resultadoCorreo[0].utilizado;
        const vencido = resultadoCorreo[0].vencido;

        const todosTokens = await TokenModelo.ultimoToken(correo);

        const usuarioMayor = todosTokens.reduce((previous, current) => {
          return current.id > previous.id ? current : previous;
        });

        if (usuarioMayor.token != tokenCambioClave) {
          res.send({
            status: "error",
            numero: 0,
            message: "Token invalido o vencido",
          });
        } else {
          if (
            (utilizado === "true" && vencido != "false") ||
            (utilizado === "false" && vencido != "false")
          ) {
            res.send({
              status: "error",
              numero: 0,
              message: "Token vencido",
            });
          } else {
            const tokenNoUtilizados = await TokenModelo.tokensSinUtilizar(
              correo,
              usuarioMayor.id
            );
            if (!claveNueva || !claveNueva2) {
              res.send({
                status: "ok",
                numero: 1,
                message: "Token validado con exito",
              });
            } else {
              const resp = validarCamposNuevaClave(claveNueva, claveNueva2);
              if (resp) {
                res.send({
                  status: resp.status,
                  numero: resp.numero,
                  message: resp.message,
                });
              } else {
                const encriptado = await bcryptjs.genSalt(5);
                const claveEncriptada = await bcryptjs.hash(
                  claveNueva,
                  encriptado
                );
                const claveActualizada = UsuarioModelo.claveSeCambio(
                  correo,
                  claveEncriptada
                );

                if (claveActualizada) {
                  const resulTokenUtilizado = await TokenModelo.tokenUtilizado(
                    tokenCambioClave
                  );
                  if (resulTokenUtilizado) {
                    res.send({
                      status: "ok",
                      numero: 1,
                      message: "Clave cambiada con exito",
                    });
                  }
                }
              }
            }
          }
        }

        /** 
        if (!claveNueva || !claveNueva2) {
          res.send({
            status: "ok",
            numero: 1,
            message: "Token validado con exito",
          });
        } else {
          const resp = validarCamposNuevaClave(claveNueva, claveNueva2);
          if (resp) {
            res.send({
              status: resp.status,
              numero: resp.numero,
              message: resp.message,
            });
          } else {
            const encriptado = await bcryptjs.genSalt(5);
            const claveEncriptada = await bcryptjs.hash(claveNueva, encriptado);
            const claveActualizada = UsuarioModelo.claveSeCambio(correo, claveEncriptada);

            if (claveActualizada) {
              const resulTokenUtilizado = await TokenModelo.tokenUtilizado(
                tokenCambioClave
              );
              if (resulTokenUtilizado) {
                res.send({
                  status: "ok",
                  numero: 1,
                  message: "Clave cambiada con exito",
                });
              }
            }
          }
        }*/
      } else {
        res.send({
          status: "error",
          numero: 0,
          message: "Token invalido o vencido",
          redirect: "/login",
        });
      }
    } catch (error) {
      console.log("Cambiando clave: " + error);
    }

    /**
    if (tokenExiste == 1) {
      if (!claveNueva || !claveNueva2) {
        res.send({
          status: "ok",
          numero: 1,
          message: "Token validado con exito",
        });
      } else {
        res.send({
          status: "ok",
          numero: 1,
          message: "Clave cambiada con exito",
        });
      }
    } else {
      res.send({
        status: "error",
        numero: 0,
        message: "Token invalido",
        redirect: "/login",
      });
    }
     */
  }
}
