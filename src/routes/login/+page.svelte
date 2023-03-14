<script>
  /* components */
  import Input from "$lib/components/Input.svelte";
  /* controllers */
  import { AuthController } from "$lib/controllers/auth/auth.controller";
  /* utils */
  import { validateEmail, validatePassword } from "$lib/utils/input-validation";
  /* assets */
  import Logo from "$lib/assets/Logo.png";

  /* consts */
  const input = {
    email: "",
    password: "",
  };

  /* dynamic vars */
  let error = false;

  /* handlers & functions */
  async function handleLogin() {
    const { error: loginError } = await AuthController.login(input);
    if (loginError) error = loginError;
  }
</script>

<div class="container">
  <div class="content">
    <div class="logo">
      <img src={Logo} alt="Company Logo" />
    </div>
    <div class="form">
      <div class="title">Inicio de Sesión</div>
      <div class={`subtitle ${!error ? "hidden" : ""}`}>
        Verifica que tus datos sean correctos
      </div>
      <div class="form-inputs">
        <form on:submit|preventDefault={handleLogin}>
          <Input
            label="Correo Electrónico"
            id="login-email"
            bind:value={input.email}
            name="email"
            type="email"
            className={`txt-field ${!error ? "normal" : "invalid"}`}
            placeholder="ejemplo@correo.com"
          />
          <Input
            label="Contraseña"
            id="login-password"
            bind:value={input.password}
            name="password"
            type="password"
            className={`txt-field ${!error ? "normal" : "invalid"}`}
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
              className={validateEmail(input.email) &&
              validatePassword(input.password)
                ? "btn"
                : "btn-disabled"}
              icon=""
            />
          </div>
        </form>
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
    background: #f3f3f3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
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
    color: #8b9eb0;
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
    color: #ff0000;
  }

  .forgot-pass-link {
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .forgot-pass-link a {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    text-decoration: none;
    color: #5585ff;
  }

  .register-link {
    display: flex;
    align-items: center;
    justify-content: center;
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
