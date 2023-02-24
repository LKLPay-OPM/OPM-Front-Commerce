<script>
  import '../app.css';
  import { auth } from "$lib/firebase";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { isLoggedIn, loggedInUser, linkSelected } from '$lib/stores';
  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { page, navigating } from '$app/stores';
  import { router } from "$lib/hooks/router.js"


  let sidebar = true;

  $: {
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