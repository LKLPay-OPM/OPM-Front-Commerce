<script>
    import {goto} from '$app/navigation'
    import {loggedInUser, isLoggedIn} from '$lib/stores.js';
    import { redirect } from '@sveltejs/kit'
    import { onMount } from 'svelte';
    import { registerUser } from '$lib/hooks/auth.js'
    import Input from '$lib/components/Input.svelte';
    import Icons from '$lib/components/Icons.svelte';
    import Select from '$lib/components/Select.svelte';
    import RedirectHome from '$lib/components/RedirectHome.svelte';

  let registerData = {
    email: "",
    password: "",
    name: "",
    lastName: "",
  }

  const handleRegister = async () => {
      const response = await registerUser(registerData.email, registerData.password, registerData)
  }
</script>
<div class="auth-form-container">
  <h1 class="auth-form-text">Registrar <Icons name="user-outline" width="32" height="32"/></h1>
  <form on:submit|preventDefault={handleRegister} class="card-body">
    <Input label="Email:" id="register-email" bind:value={registerData.email} type="email"/>
    <Input label="Password:" id="register-password" bind:value={registerData.password} type="password"/>
    <Input label="Nombre:" id="register-name" bind:value={registerData.name} type="text"/>
    <Input label="Apellidos:" id="register-last-name" bind:value={registerData.lastName} type="text"/>
    <button type="submit" class="btn btn-auth-form">Registrarme</button>
  </form>
  <div>
    ¿Ya tienes una cuenta?. <a href="/">Ingresar</a>
  </div>
</div>