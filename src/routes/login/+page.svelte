<script>
  /* svelte */
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  /* store */
  import { isLoggedIn } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import Loader from "$lib/components/Loader.svelte";
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
  let loading = true;

  /* handlers & functions */
  async function handleLogin() {
    const data = await AuthController.login(input);
    if (data?.error) error = data.error;
  }

  onMount(async () => {
    if ($isLoggedIn) await goto("/");
    loading = false;
  });
</script>

{#if loading}
  <Loader />
{:else}
  <div class="container">
    <div class="content">
      <div class="logo">
        <img src={Logo} alt="Company Logo" />
        <div class="text">
          <p>LKL Pay</p>
          <small>Financial Technology</small>
        </div>
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
{/if}

<style lang="scss">
  @import "src/lib/styles/login.scss";
</style>
