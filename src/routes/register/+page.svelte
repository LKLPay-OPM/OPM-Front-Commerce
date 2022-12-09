<script>
    import {goto} from '$app/navigation'
    import {loggedInUser, isLoggedIn} from '$lib/stores.js';
    import { redirect } from '@sveltejs/kit'
    import { onMount } from 'svelte';
    import { registerUser } from '$lib/hooks/auth.js'
    import Input from '$lib/components/Input.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Icons from '$lib/components/Icons.svelte';
    import Select from '$lib/components/Select.svelte';
    import RedirectHome from '$lib/components/RedirectHome.svelte';
    import Logo from '$lib/assets/Logo.png';
    import SuccessLogo from '$lib/components/Success.svelte';
    import ErrorLogo from '$lib/components/Error.svelte';
  let registerData = {
    email: "",
    password: "",
    name: "",
    lastName: "",
    firstTimeUser: true,
    depositPreference: "weekly",
    statusBankAccountInfo: "pending",
    total: 0,
    toDeposit: 0,
  }
  let menu = "register"
  let terms = false;
  let confirmPass = "";
  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

  const handleRegister = async () => {
    const response = await registerUser(registerData.email, registerData.password, registerData)
    .then(() => {
      menu = "success"
    })
    .catch(() => {
      menu = "error"
    })
  }
</script>

{#if menu === "register"}
<div class="container">
  <div class="content">
    <div class="logo">
      <img src={Logo} alt="Company Logo">
    </div>
    <div class="form">
      <div class="title">Regístrate en Lkl Pay</div>
      <div class="subtitle">Simple y rápido</div>
      <div class="form-inputs">
        <form on:submit|preventDefault={handleRegister}>
          <Input 
            label="Dirección de correo electrónico" 
            id="register-email" 
            bind:value={registerData.email} 
            type="email" 
            className={`txt-field ${registerData.email.match(emailPattern) ? "valid" : "invalid"}`}
          />
          <Input 
            label="Contraseña" 
            id="register-password" 
            bind:value={registerData.password} 
            type="password" 
            className={`txt-field ${registerData.password.match(passPattern) ? "valid" : "invalid"}`}
          />
          <div class="pass-conditions">
            <p class="{registerData.password.match(passPattern) ? "valid":"invalid"}">
              Tu contraseña debe de tener <br>
              <span class="{registerData.password.length >= 8 ? "valid":"invalid"}"> 8 caracteres </span>|
              <span class="{registerData.password.match(/[A-Z]/g) ? "valid":"invalid"}"> 1 Mayúscula </span>|
              <span class="{registerData.password.match(/[a-z]/g) ? "valid":"invalid"}"> 1 Minúscula </span>|
              <span class="{registerData.password.match(/[0-9]/g) ? "valid":"invalid"}"> 1 Número </span>
            </p>
          </div>
          <Input 
            label="Confirmar Contraseña" 
            id="confirmRegisterPassword" 
            bind:value={confirmPass} 
            type="password" 
            className={`txt-field ${confirmPass != "" && confirmPass === registerData.password ? "valid" : "invalid"}`}
          />
          <div class="terms">
            <div class="terms-checkbox">
              <Checkbox bind:checked={terms}/>
            </div>
            <p>
              He Leído, entendido y acepto los <br>
              <a href="/register#terms">Términos y Condiciones Generales</a> de Lkl Pay, <br>
              así como su <a href="/register#privacy">Política de Privacidad</a> y, por lo tanto <br>
              estoy de acuerdo en el uso y procesamiento de <br>
              datos personales.
            </p>
          </div>
          <div class="btn-layout">
            <Input 
              label="Crear Cuenta" 
              id="registerButton" 
              type="submit" 
              className="{
                registerData.email.match(emailPattern) &&
                registerData.password.match(passPattern) &&
                confirmPass != "" &&
                confirmPass === registerData.password &&
                terms ?
                "btn" : "btn-disabled"
              }" 
              icon=""/>
          </div>
        </form>
        <div class="login-link">
          Ya tengo una cuenta.<a href="/"> Quiero Iniciar Sesión</a>
        </div>
      </div>
    </div>
  </div>
</div>
{:else if menu === "success"}
<div class="container">
  <div class="success-content">
    <div class="logo">
      <img src={Logo} alt="Company Logo">
    </div>
    <div class="form">
      <div class="title">Bienvenido a LKL Pay</div>
      <div class="svg">
        <SuccessLogo/>
      </div>
      <div class="subtitle">Ingresa a tu correo para verificar tu cuenta</div>
      <div class="btn-layout">
        <Input 
          label="Ir a mi Escritorio" 
          id="goToDashboardBtn" 
          type="button" 
          className="btn-success" 
          icon=""
          on:click={() => (isLoggedIn.update(() => true))}
          on:click={() => (goto("/home"))}
        />
      </div>
    </div>
  </div>
</div>
{:else if menu === "error"}
<div class="container">
  <div class="error-content">
    <div class="logo">
      <img src={Logo} alt="Company Logo">
    </div>
    <div class="form">
      <div class="title">Ups, Algo salió mal</div>
      <div class="svg">
        <ErrorLogo/>
      </div>
      <div class="subtitle">Vamos a intentar crear tu cuenta de nuevo</div>
      <div class="btn-layout">
        <Input 
          label="Reiniciar Registro" 
          id="returnToRegisterBtn" 
          type="button" 
          className="btn-error" 
          icon=""
          on:click={() => (menu = "register")}  
        />
      </div>
    </div>
  </div>
</div>
{/if}

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
    height: 42rem;
    background: #F3F3F3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }

  .success-content {
    position: absolute;
    width: 27rem;
    height: 34rem;
    background: #F3F3F3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }
  .error-content {
    position: absolute;
    width: 27rem;
    height: 34rem;
    background: #F3F3F3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }

  .logo {
    margin-top: 2rem;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .logo img {
    width: 18rem;
    height: 3.375rem;
  }

  .form {
    width: 100%;
    height: 100%;
    padding-top: 1.5rem;
    padding-bottom: 2rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .svg {
    display: flex;
    justify-content: center;
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
    margin-bottom: .75rem;
  }

  .subtitle {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8B9EB0;
  }

  .pass-conditions p{
    font-weight: 700;
    font-size: .8125rem;
    line-height: 1.25rem;
  }

  .invalid {
    color: #FD9053;
  }

  .valid {
    color: #00C48C;
  }

  .terms {
    display: flex;
    flex-direction: row;
    height: 5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: .8125rem;
    line-height: 1.25;
    display: flex;
    align-items: center;
    color: #8B9EB0;
  }

  .terms a {
    text-decoration: none;
    color: #5585FF;
  }

  .terms-checkbox {
    height: 100%;
    margin-right: .4375rem;
    display: flex;
    align-items: start;
  }

  .login-link {
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    color: #8B9EB0;
  }
  .login-link a{
    
    text-decoration: none;
    color: #5585FF;
  }

  .form-inputs {
    height: calc(100% - 2rem);
    width: 100%;
    /* padding-top: 1rem; */
  }

  .btn-layout {
    display: flex;
    justify-content: center;
    height: 3.375rem;
    width: 100%;
    margin-bottom: 1.125rem;
    margin-top: 1.125rem;
  }
</style>