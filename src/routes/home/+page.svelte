<script>
  import { isLoggedIn, loggedInUser, onboardingSuccess } from "$lib/stores";
  import Onboarding from "$lib/components/Onboarding.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
</script>

{#if $isLoggedIn === true}
  {#if $loggedInUser?.firstTimeUser == true || $onboardingSuccess == true}
    <Onboarding />
  {:else}
    <Dashboard />
  {/if}
{/if}

<style>
</style>
