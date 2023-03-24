<script>
  import "../app.scss";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { isLoggedIn, sidebar } from "$lib/stores";
  import { navigating } from "$app/stores";

  let innerWidth = 0;
  let innerHeight = 0;

  $: {
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
