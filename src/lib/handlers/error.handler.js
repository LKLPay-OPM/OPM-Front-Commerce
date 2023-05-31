/* controllers */
import { AuthController } from "$lib/controllers/auth/auth.controller";

export async function appErrorResponseHandler (error){
  if(error?.response?.data?.code === "NO_TOKEN_OR_INACTIVE"){
    await AuthController.logout();
  }
} 