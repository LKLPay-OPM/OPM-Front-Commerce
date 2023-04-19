<script>
  import {loggedInUser} from '$lib/stores.js';
  // import { resetPass } from '$lib/hooks/auth.js';
  import Input from '$lib/components/Input.svelte';
  import Icons from '$lib/components/Icons.svelte';

  let loginData = {
      email: ""
  }

  const handleResetPass = async () => {
      const response = await resetPass(loginData.email)
  }
</script>

<div class="auth-form-container">
  <h1 class="auth-form-text">Olvidé mi Contraseña <Icons name="user-outline" width="32" height="32"/></h1>
  <form on:submit|preventDefault={handleResetPass} class="card-body">
    <div>
      Ingresa tu cuenta de correo asociada a LKLPay
    </div>
      <Input label="Email:" id="login-email" bind:value={loginData.email} type="email"/>
      <button type="submit" class="btn btn-auth-form">Enviar Correo</button>
  </form>
  <div>
    ¿Ya tienes una cuenta?. <a href="/">Ingresar</a>
  </div>
  <div>
    ¿No tienes una cuenta?. <a href="/register">Regístrate</a>
  </div>
</div>
