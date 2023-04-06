<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Transactions from "$lib/components/Transactions.svelte";
  import { onMount } from "svelte";

  export let data;

  let loading = false;

  onMount(async () => {
    // await fetchByDayButton();
  });
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader />
  {:else}
    <Transactions bind:user={$loggedInUser} {data} />
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style>
</style>
