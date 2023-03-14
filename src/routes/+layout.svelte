<script>
  import "../app.scss";
  import { auth } from "$lib/firebase";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { isLoggedIn, loggedInUser, linkSelected, sidebar } from "$lib/stores";
  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { page, navigating } from "$app/stores";
  import { router } from "$lib/hooks/router.js";

  let innerWidth = 0;
  let innerHeight = 0;

  $: {
    if ($isLoggedIn) {
      router($loggedInUser.accountType, $page.routeId).then((response) => {
        if ($isLoggedIn && !response) {
          $linkSelected = "Inicio";
          goto("/");
        }
      });

      if (innerWidth <= 768) {
        $sidebar = false;
      }
    }
  }

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        goto("/");
      } else {
        isLoggedIn.update(() => false);
        loggedInUser.set({});
        sessionStorage.clear();
        goto("/login");
      }
    });
  });
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="layout">
  {#if $navigating}
    <loader />
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
