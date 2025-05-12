<script>
  /* styles */
  import "toastify-js/src/toastify.css";
  import "../app.scss";
  /* components */
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  /* stores */
  import { isLoggedIn, loggedInUser, darkMode, linkSelected } from "$lib/stores";
  /* sveltekit */
  import { page, navigating } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  /* utils */
  import { checkRouter } from "$lib/utils/verifyRoute";
  import { getToastType } from "$lib/utils/getToastType";
  /* consts */
  import { routes } from "$lib/constants/routes";
  /* controllers */
  import { AuthController } from "$lib/controllers/auth/auth.controller";
  /* hooks */
  import { router } from "$lib/hooks/router.js";

  let innerWidth = 0;
  let innerHeight = 0;
  let toastModal;

  $: {
    if ($isLoggedIn) {
      router($loggedInUser.accountType, $page.route.id).then((response) => {
        if (!response) {
          $linkSelected = "Inicio";
          goto("/");
        }
      });
    } else {
      AuthController.validateUser($page.route.id).then((res) => {
        if (!res && browser) {
          goto("/login");
        }
      });
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
  <title>OPM Boost</title>
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
