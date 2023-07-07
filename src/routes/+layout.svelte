<script>
  /* styles */
  import "toastify-js/src/toastify.css";
  import "../app.scss";
  /* components */
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  /* stores */
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  /* sveltekit */
  import { page, navigating } from "$app/stores";
  /* utils */
  import { checkRouter } from "$lib/utils/verifyRoute";

  let innerWidth = 0;
  let innerHeight = 0;

  $: {
    if ($isLoggedIn) {
      checkRouter($loggedInUser, $page);
    }
  }
</script>

<svelte:head>
  <title>Lkl Pay Boost</title>
</svelte:head>
<svelte:window bind:innerWidth bind:innerHeight />

<div class="layout">
  {#if $navigating}
    <Loader />
  {:else}
    {#if $isLoggedIn}
      <Sidebar />
    {/if}
    <section class={$isLoggedIn ? " main-section" : "no-user"}>
      <div class="main-content">
        <slot />
      </div>
    </section>
  {/if}
</div>
