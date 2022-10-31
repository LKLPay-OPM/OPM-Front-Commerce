<script>
    import {loggedInUser} from '$lib/stores.js';
    import { login } from '$lib/hooks/auth.js';
    import Input from '$lib/components/Input.svelte';

    let loginData = {
        email: "",
        password: "",
    }

    const handleLogin = async () => {
        const response = await login(loginData.email, loginData.password)
    }
</script>

<h1 class="dataForm text-center text-4xl">Log In</h1>
<div class="dataForm container mx-auto">
    <form on:submit|preventDefault={handleLogin} class="cardBody" style="max-width: 400px">
        <Input label="Email:" id="login-email" bind:value={loginData.email} type="email"/>

        <Input label="Password:" id="login-password" bind:value={loginData.password} type="password"/>

        <button type="submit" class="btn btn-primary">Log In</button>
    </form>
</div>