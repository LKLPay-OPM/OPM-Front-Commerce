<script>
  /* styles */
  import "toastify-js/src/toastify.css";
  import "../app.scss";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { isLoggedIn, sidebar, loggedInUser, linkSelected } from "$lib/stores";
  import { goto } from "$app/navigation";
  import { page, navigating } from "$app/stores";
  import { router } from "$lib/hooks/router.js";

  let innerWidth = 0;
  let innerHeight = 0;

  async function checkRouter() {
    if ($isLoggedIn) {
      const response = await router($loggedInUser.accountType, $page.route.id);
      if ($isLoggedIn && !response) {
        linkSelected.set("Inicio");
        await goto("/");
      }
    }
  }

  $: {
    if (innerWidth <= 768) {
      $sidebar = false;
    } else {
      $sidebar = true;
    }

    checkRouter();
  }
</script>

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
