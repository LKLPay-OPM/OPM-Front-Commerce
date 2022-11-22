<script>
  import '../app.css';
  import { auth } from "$lib/firebase";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { page, navigating } from '$app/stores';

  let sidebar = true;

  onMount(() => {
    //console.log($page)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //isLoggedIn.update(() => true);
        
        // goto('/home');
      } else {
        isLoggedIn.update(() => false);
        loggedInUser.set({})
        sessionStorage.clear();
        goto("/");
      }
    });
  });
</script>

<div class="layout">
  {#if $navigating}
    <Loader/>
    {:else}
      {#if $isLoggedIn}
        <Sidebar/>
      {/if}
      <section class="{$isLoggedIn ? "main-section" : "no-user"}">
        <div class="main-content">
          <slot/>
        </div>
      </section>
  {/if}
</div>

<style>
  
</style>