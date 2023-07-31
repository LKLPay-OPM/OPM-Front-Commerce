<script>
  /* styles */
  import "toastify-js/src/toastify.css";
  import "../app.scss";
  /* components */
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Toast from "$lib/components/Toast.svelte";
  /* stores */
  import { isLoggedIn, loggedInUser, darkMode, toastMsg, toastShown, toastType } from "$lib/stores";
  /* sveltekit */
  import { page, navigating } from "$app/stores";
  import { browser } from "$app/environment";
  /* utils */
  import { checkRouter } from "$lib/utils/verifyRoute";
  import { getToastType } from "$lib/utils/getToastType";
  import { toast } from "$lib/utils/toast";
  /* constants */
  import { danger, success } from "$lib/constants/colors";

  let innerWidth = 0;
  let innerHeight = 0;
  let toastModal;

  $: {
    if ($isLoggedIn) {
      checkRouter($loggedInUser, $page);
    }
    if (browser) {
      if ($darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      if ($toastShown) {
        console.log(toastModal);
        toastModal.showModal();
        setTimeout(() => {
          toastModal.close();
          $toastMsg = "";
          $toastType = "";
          $toastShown = false;
        }, 3000);
      }
    }
  }

  $: {
    console.log($toastShown);
    console.log($toastType);
    console.log($toastMsg);
  }
</script>

<svelte:head>
  <title>Lkl Pay Boost</title>
</svelte:head>
<svelte:window bind:innerWidth bind:innerHeight />

<div class="layout">
  {#key $toastShown}
    <dialog id="toastDialog" bind:this={toastModal}>
      {#if $toastShown}
        <div>
          {getToastType($toastType, $toastMsg)}
        </div>
      {/if}
    </dialog>
  {/key}
  {#if browser}{/if}
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
