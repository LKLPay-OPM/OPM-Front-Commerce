<script>
  /* svelte */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn, linkSelected } from "$lib/stores";
  /* components */
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";

  export let data;

  /* dynamic vars */
  let loading = true;

  onMount(async () => {
    if (!$isLoggedIn) await goto("/login");
    loading = false;
    $linkSelected = "Inicio";
  });
</script>

{#if $isLoggedIn}
  {#if loading}
    <Loader />
  {:else}
    <Dashboard bind:data />
  {/if}
{:else}
  <RedirectLogin />
{/if}
