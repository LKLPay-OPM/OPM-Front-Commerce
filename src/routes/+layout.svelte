<script>
  import '../app.css';
  import { auth } from "$lib/firebase";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { isLoggedIn, loggedInUser, linkSelected, sidebar } from '$lib/stores';
  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { page, navigating } from '$app/stores';
  import { router } from "$lib/hooks/router.js"

  let innerWidth = 0
	let innerHeight = 0

  // let sidebar = true;

  $: {
    // console.log(innerWidth)
    if ($isLoggedIn) {
      router($loggedInUser.accountType, $page.routeId)
      .then((response) => {
        if($isLoggedIn && !response){
          $linkSelected = 'Inicio';
          goto('/')
          // console.log(response)
          // console.log("DENEGADO")
        }
      })

      if (innerWidth <= 768) {
        $sidebar = false
      }
    }
  }

  onMount(() => {
    //console.log($page)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //isLoggedIn.update(() => true);
        
        goto('/');
      } else {
        isLoggedIn.update(() => false);
        loggedInUser.set({})
        sessionStorage.clear();
        goto("/login");
      }
    });
  });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="layout">
  {#if $navigating}
    <Loader/>
    {:else}
      <!-- {#if $isLoggedIn && innerWidth > 640}
        <Sidebar/>
      {/if} -->
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