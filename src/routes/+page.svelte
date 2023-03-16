<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
  import { onMount } from "svelte";
  import { ProfileController } from "$lib/controllers/profile/profile.controller";

  onMount(async () => {
    const profile = await ProfileController.getProfile();
    if (profile?.error) return { error: true, message: String(profile.error) };
    const data = { saludo: "hola", profile };
    console.log(data);
  });
</script>

{#if $isLoggedIn}
  {#if !$loggedInUser.$id}
    <Loader />
  {:else}
    <Dashboard />
  {/if}
{/if}
