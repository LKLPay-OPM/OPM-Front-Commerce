<script>
  import {loggedInUser} from '$lib/stores.js';
  import { login } from '$lib/hooks/auth.js';
  import Input from '$lib/components/Input.svelte';
  import Icons from '$lib/components/Icons.svelte';

  let loginData = {
      email: "",
      password: "",
  }

  const handleLogin = async () => {
      const response = await login(loginData.email, loginData.password)
  }
</script>

<div class="auth-form-container">
  <h1 class="auth-form-text">Inicia Sesión <Icons name="user-outline" width="32" height="32"/></h1>
  <form on:submit|preventDefault={handleLogin} class="card-body">
      <Input label="Email:" id="login-email" bind:value={loginData.email} type="email"/>
      <Input label="Password:" id="login-password" bind:value={loginData.password} type="password"/>
      <div class="btn-layout">
        <Input 
          label="Iniciar Sesión" 
          id="loginButton" 
          type="submit" 
          className="button {
            loginData.email != "" &&
            loginData.password != "" ?
            "" : "disabled"
          }" 
          icon=""/>
      </div>
      <div class="auth-form-text">
        <a href="/forgot-pass">Olvidé mi contraseña.</a>
      </div>
  </form>
  <div>
    ¿No tienes una cuenta?. <a href="/register">Regístrate</a>
  </div>
</div>

<style>
  .btn-layout {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>