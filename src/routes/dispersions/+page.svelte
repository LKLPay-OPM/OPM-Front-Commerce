<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Layout from "$lib/components/dispersions/Layout.svelte";
  import { onMount } from "svelte";

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let dispersions = [];
  let selectedDispersion = {};
  let dispersionDetailView = false;
  let notFound = false;
  let loading = false;
  let active = "day";

  export let data;

  $: {
    console.log(data);
  }

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
    {#key data}
      <Layout bind:user={$loggedInUser} {data} />
    {/key}
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
</style>
