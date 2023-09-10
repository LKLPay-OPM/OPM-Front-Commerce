<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import PasswordInput from "$lib/components/inputs/PasswordInput.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import SuccessLogo from "$lib/components/Success.svelte";
  import ErrorLogo from "$lib/components/Error.svelte";
  import Loader from "$lib/components/Loader.svelte";
  /* assets */
  import Logo from "$lib/assets/Logo.png";
  /* constants */
  import { emailPattern, passwordPattern } from "$lib/constants/pattern";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  import { AuthController } from "$lib/controllers/auth/auth.controller";

  let customMessage = "";
  let registerData = {
    email: "",
    password: "",
  };
  let menu = "register";
  let terms = false;
  let loading = false;
  let confirmPass = "";
  let registerResponse = {};

  const handleRegister = async () => {
    /* loading = true;
    setTimeout(async () => {
      try {
        const { session, user, error, message } = await AuthController.register(registerData);
        registerResponse = { session, user };
        if (error) {
          throw message;
        }
        menu = "success";
      } catch (e) {
        menu = "error";
        const handler = await appErrorResponseHandler(e);
        const code = handler?.code ?? 500;
        const message = handler?.message ?? "¡Algo salió mal!";
        customMessage = message;
        throw new error(code, message);
      } finally {
        loading = false;
      }
    }, 3000); */
  };
</script>

<div class="container">
  {#if loading}
    <Loader />
  {:else if menu === "register"}
    <div class="content">
      <div class="logo">
        <img src={Logo} alt="Company Logo" />
      </div>
      <div class="form">
        <div class="title">Modificar Contraseña</div>
        <div class="subtitle">Ingresa tu nueva contraseña</div>
        <div class="form-inputs">
          <form on:submit|preventDefault={handleRegister}>
            <PasswordInput
              label="Nueva Contraseña"
              id="newPassword"
              bind:value={registerData.password}
              placeholder="Contraseña"
              className={`txt-field ${
                registerData.password === ""
                  ? "normal"
                  : registerData.password.match(passwordPattern)
                  ? "valid"
                  : "invalid"
              }`}
            />
            <div class="pass-conditions">
              <div class={registerData.password.match(passwordPattern) ? "valid" : "invalid"}>
                <p class="description">Tu contraseña debe de tener</p>
                <p class="conditions">
                  <span class={registerData.password.length >= 8 ? "valid" : "invalid"}> 8 caracteres </span>|
                  <span class={registerData.password.match(/[A-Z]/g) ? "valid" : "invalid"}> 1 Mayúscula </span>|
                  <span class={registerData.password.match(/[a-z]/g) ? "valid" : "invalid"}> 1 Minúscula </span>|
                  <span class={registerData.password.match(/[0-9]/g) ? "valid" : "invalid"}> 1 Número </span>|
                  <span class={registerData.password.match(/(?=.*[^\da-zA-Z])/g) ? "valid" : "invalid"}>
                    1 Símbolo
                  </span>
                </p>
              </div>
            </div>
            <PasswordInput
              label="Confirmar Nueva Contraseña"
              id="confirmNewPassword"
              bind:value={confirmPass}
              placeholder="Contraseña"
              className={`txt-field ${
                registerData.password === ""
                  ? "normal"
                  : registerData.password != "" &&
                    confirmPass === registerData.password &&
                    confirmPass.match(passwordPattern)
                  ? "valid"
                  : "invalid"
              }`}
            />
            <div class="btn-layout">
              <Input
                label="Aceptar"
                id="btnSubmit"
                type="submit"
                className={registerData.password.match(passwordPattern) &&
                confirmPass != "" &&
                confirmPass === registerData.password
                  ? "btn"
                  : "btn-disabled"}
                icon=""
              />
            </div>
          </form>
          <div class="login-link">
            Ya tengo una cuenta.<a href="/"> Quiero Iniciar Sesión</a>
          </div>
        </div>
      </div>
    </div>
  {:else if menu === "success"}
    <div class="success-content">
      <div class="logo">
        <img src={Logo} alt="Company Logo" />
      </div>
      <div class="form">
        <div class="title">LKL Pay</div>
        <div class="subtitle">Inicia Sesión con tu nueva contraseña</div>
        <div class="svg success">
          <Icons name="checkbox-circle-line" width="150" height="150" />
          <!-- <SuccessLogo /> -->
        </div>
      </div>
      <div class="btn-layout">
        <Input
          label="Iniciar Sesión"
          id="btnRedirectLogin"
          type="button"
          className="btn-success"
          icon=""
          on:click={() => goto("/login")}
        />
      </div>
    </div>
  {:else if menu === "error"}
    <div class="error-content">
      <div class="logo">
        <img src={Logo} alt="Company Logo" />
      </div>
      <div class="form">
        <div class="title">Ups, Algo salió mal</div>
        <div class="svg error">
          <Icons name="close-circle-line" width="150" height="150" />
          <!-- <ErrorLogo /> -->
        </div>
        <!-- <div class="subtitle">{customMessage}</div> -->
        <div class="subtitle">Ocurrió un error, vuelve a intentarlo</div>
      </div>
      <div class="btn-layout">
        <Input
          label="Volver a Intentar"
          id="btnTryAgain"
          type="button"
          className="btn-error"
          icon=""
          on:click={() => (menu = "register")}
        />
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
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
    background: $background-light-secondary;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }

  .success-content {
    position: absolute;
    width: 27rem;
    height: 34rem;
    background: $background-light-secondary;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .error-content {
    position: absolute;
    width: 27rem;
    height: 34rem;
    background: $background-light-secondary;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    transform: matrix(1, 0, 0, 1, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .logo {
    margin-top: 2rem;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .logo img {
    width: 5rem;
  }

  .form {
    width: 100%;
    padding-top: 1.5rem;
    padding-bottom: 2rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .svg {
    display: flex;
    justify-content: center;
    &.success {
      color: $success-light;
    }
    &.error {
      color: $error-light;
    }
  }

  .title {
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $grey;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $grey;
  }

  .pass-conditions p {
    display: flex;
    font-weight: 700;
    font-size: 0.7rem;
    line-height: 1.25rem;

    &.conditions {
      justify-content: space-between;
    }
  }

  .invalid {
    color: #fd9053;
  }

  .valid {
    color: #00c48c;
  }

  .terms {
    display: flex;
    flex-direction: row;
    height: 5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25;
    display: flex;
    align-items: center;
    color: $grey;
  }

  .terms a {
    text-decoration: none;
    color: #5585ff;
  }

  .terms-checkbox {
    height: 100%;
    margin-right: 0.4375rem;
    display: flex;
    align-items: start;
  }

  .login-link {
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    color: $grey;
  }
  .login-link a {
    text-decoration: none;
    color: #5585ff;
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
    padding: 0 2rem;
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .content,
    .error-content,
    .success-content {
      background: $background-dark;
      box-shadow: 20px 20px 40px #202020, -20px -20px 60px #303030;
    }
  }

  /* MEDIA */
  /* XSmall Screen */
  @media screen and (max-width: $xs) {
    .content {
      width: 26rem;
    }
  }
  /* Small Screen */
  @media screen and (min-width: $xs) and (max-width: $sm) {
    .content {
      width: fit-content;
    }
  }
  /* Medium Screen */
  @media screen and (min-width: $sm) and (max-width: $md) {
    .content {
      width: fit-content;
    }
  }

  /* Large Screen */
  @media screen and (min-width: $md) and (max-width: $lg) {
  }

  /* XLarge Screen */
  @media screen and (min-width: $lg) and (max-width: $xl) {
  }
</style>
