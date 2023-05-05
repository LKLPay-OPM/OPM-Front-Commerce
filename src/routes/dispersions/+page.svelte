<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Dispersions from "$lib/components/Dispersions.svelte";
  import { onMount } from "svelte";

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let dispersions = [];
  let selectedDispersion = {};
  let dispersionDetailView = false;
  let notFound = false;
  let loading = false;
  let active = "day";

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  onMount(async () => {
    // await fetchByDayButton()
    dispersions = [...$loggedInUser.dispersions];
  });

  const dispersionFound = () => {
    if (dispersions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader />
  {:else}
    <Dispersions bind:user={$loggedInUser} />
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
</style>
