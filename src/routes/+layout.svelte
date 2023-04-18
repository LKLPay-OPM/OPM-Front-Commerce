<script>
  import "../app.scss";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { isLoggedIn, sidebar, loggedInUser, linkSelected } from "$lib/stores";
  import { goto } from '$app/navigation';
  import { page, navigating } from "$app/stores";
  import { router } from '$lib/hooks/router.js';

  let innerWidth = 0;
  let innerHeight = 0;

  $: {
    if ($isLoggedIn) {
      router($loggedInUser.accountType, $page.routeId)
      .then((response) => {
        if($isLoggedIn && !response){
          $linkSelected = 'Inicio';
          goto('/')
        }
      })
    }
    if (innerWidth <= 768) {
      $sidebar = false;
    } else {
      $sidebar = true;
    }
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
