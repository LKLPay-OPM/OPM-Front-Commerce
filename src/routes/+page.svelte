<script>
  /* svelte */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn } from "$lib/stores";
  /* components */
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";

  export let data;

  let transactions = data.transactions;

  /* dynamic vars */
  let loading = true;

  $: {
    console.log(data);
  }

  onMount(async () => {
    if (data?.redirect) await goto(data.path);
    loading = false;
  });
</script>

{#if $isLoggedIn}
  {#if loading}
    <Loader />
  {:else}
    <Dashboard bind:transactions />
  {/if}
{:else}
  <RedirectLogin />
{/if}
