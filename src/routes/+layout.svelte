<script>
  /* styles */
  import "toastify-js/src/toastify.css";
  import "../app.scss";
  /* components */
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  /* stores */
  import {
    isLoggedIn,
    loggedInUser,
    darkMode,
    linkSelected,
  } from "$lib/stores";
  /* sveltekit */
  import { page, navigating } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  /* utils */
  import { checkRouter } from "$lib/utils/verifyRoute";
  import { getToastType } from "$lib/utils/getToastType";
  /* consts */
  import { routes } from "$lib/constants/routes";

  let innerWidth = 0;
  let innerHeight = 0;
  let toastModal;

  $: {
    if ($isLoggedIn) {
      const regexp = new RegExp(
        "(profile|transactions|dispersions|requests|payment-link|help)"
      );
      $linkSelected = routes($page.route.id.match(regexp)?.[0] ?? "");
      checkRouter($loggedInUser, $page);
    } else {
      if (browser) {
        goto("/login");
      }
    }
    if (browser) {
      if ($darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
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
    {#key $darkMode}
      {#if $isLoggedIn}
        <Sidebar />
      {/if}
      <section class={$isLoggedIn ? "main-section" : "no-user"}>
        <div class="main-content">
          <slot />
        </div>
      </section>
    {/key}
  {/if}
</div>
