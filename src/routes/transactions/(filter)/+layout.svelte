<script>
  /* stores */
  import { isLoggedIn, loggedInUser, previousPage } from "$lib/stores";
  /* components */
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import LayoutTransactions from "$lib/components/transactions/Layout.svelte";
  /* navigation */
  import { goto, afterNavigate, beforeNavigate } from "$app/navigation";

  export let data;
  let loading = false;

  beforeNavigate((navigation) => {
    $previousPage = navigation.to.url.pathname;
    console.log($previousPage);
  });

  $: {
  }
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader />
  {:else}
    <LayoutTransactions bind:user={$loggedInUser} {data}>
      <slot />
    </LayoutTransactions>
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style>
</style>
