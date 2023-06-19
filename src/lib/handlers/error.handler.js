/* controllers */
import { AuthController } from "$lib/controllers/auth/auth.controller";

export async function appErrorResponseHandler (error){
  console.log(error?.response?.data)
  if(error?.response?.data?.code === "NO_TOKEN_OR_INACTIVE"){
    await AuthController.logout();
  }
  if(error?.response?.data?.code === "DATABASE_ERROR"){
    return { code: error?.response?.status, message: error?.response?.data?.message}
  }
  if(error?.response?.data?.code === "EMAIL_EXISTS"){
    return { code: error?.response?.status, message: error?.response?.data?.message}
  }
  if(error?.response?.data?.code === "ERR_BAD_REQUEST"){
    return { code: error?.response?.status, message: error?.response?.data?.message}
  }
  if(error?.response?.status === 404){
    return { code: error?.response?.status, message: "No se encontró el recurso solicitado"}
  }
  /* axios errors */
  /* if(error?.code === "ERR_BAD_RESPONSE"){
    return { code: error?.response?.data?.statusCode, message: error?.response?.data ?? "Problemas de conexión con la Base de Datos"}
  } */
  if(error?.code === "ECONNREFUSED"){
    return { code: 521, message: "Ocurrió un error de conexión"}
  }
  if(error?.code === "ERR_NETWORK"){
    return { code: 522, message: "Ocurrió un error de conexión"}
  }
} 