<script>
  import {loggedInUser, isLoggedIn} from '$lib/stores.js';
  import { login } from '$lib/hooks/auth.js';
  import Input from '$lib/components/Input.svelte';
  import Icons from '$lib/components/Icons.svelte';
  import Logo from '$lib/assets/Logo.png';
  import {goto} from '$app/navigation';

  let loginData = {
      email: "",
      password: "",
  }

  let error = false;
  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

  const handleLogin = async () => {
    try {
      const response = await login(loginData.email, loginData.password)
      .then(() =>{
        goto('/home')
        isLoggedIn.update(() => true)
      })
    } catch (err) {
      error = true;
    }
  }
</script>

<div class="container">
  <div class="content">
    <div class="logo">
      <img src={Logo} alt="Company Logo">
    </div>
    <div class="form">
      <div class="title">Inicio de Sesión</div>
      <div class={`subtitle ${!error ? "hidden" : ""}`}>Verifica que tus datos sean correctos</div>
      <div class="form-inputs">
        <form on:submit|preventDefault={handleLogin}>
          <Input 
            label="Correo Electrónico" 
            id="login-email" 
            bind:value={loginData.email} 
            type="email" 
            className={`txt-field ${
              loginData.email === "" ||
              loginData.email != "" && loginData.email.match(emailPattern) ||
              loginData.email != "" && loginData.email.match(emailPattern) && !error ?
              "normal" : "invalid"}`}
            placeholder="ejemplo@correo.com"
          />
          <Input 
            label="Contraseña" 
            id="login-password" 
            bind:value={loginData.password} 
            type="password" 
            className={`txt-field ${
              loginData.password === "" ||
              loginData.password != "" && loginData.password.match(passPattern) ||
              loginData.password.match(passPattern) && !error ?
              "normal" : "invalid"}`}
            placeholder="contraseña"  
          />
          <div class="forgot-pass-link">
            <a href="/forgot-pass">Olvidé mi Contraseña</a>
          </div>
          <div class="btn-layout">
            <Input 
              label="Iniciar Sesión" 
              id="loginButton" 
              type="submit" 
              className="{
                loginData.email.match(emailPattern) &&
                loginData.password.match(passPattern) ?
                "btn" : "btn-disabled"
              }" 
              icon=""/>
          </div>  
        </form>
        <div class="register-link">
          <a href="/register">Quiero crear una cuenta</a>
        </div>
      </div>
    </div>
  </div>
</div>


<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    position: absolute;
    width: 27rem;
    height: 37rem;
    background: #F3F3F3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }

  .logo {
    margin-top: 3.75rem;
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .form {
    width: 100%;
    height: 100%;
    padding-top: 3.125rem;
    padding-bottom: 2rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .title {
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8B9EB0;
  }

  .subtitle {
    margin-top: 1rem;
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FF0000;
  }

  .forgot-pass-link {
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .forgot-pass-link a{
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    text-decoration: none;
    color: #5585FF;
  }

  .register-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .register-link a{
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    text-decoration: none;
    color: #5585FF;
  }

  .form-inputs {
    height: calc(100% - 2rem);
    width: 100%;
    margin-top: 3rem;
  }

  .btn-layout {
    display: flex;
    justify-content: center;
    height: 3.375rem;
    width: 100%;
    margin-bottom: 1.125rem;
    margin-top: 1.125rem;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>