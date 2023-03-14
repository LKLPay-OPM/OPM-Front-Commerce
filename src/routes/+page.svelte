<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
</script>

{#if $isLoggedIn}
  {#if !$loggedInUser.uid}
    <Loader />
  {:else}
    <Dashboard />
  {/if}
{/if}
