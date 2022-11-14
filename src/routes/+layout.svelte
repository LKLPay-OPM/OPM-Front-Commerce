<script>
  import '../app.css';
  import { auth } from "$lib/firebase";
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';

  onMount(() => {
    //console.log($page)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //isLoggedIn.update(() => true);
        
        //goto('/home')
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
  {#if $isLoggedIn}
    <aside id="sidebar" class="sidebar">
      <Sidebar/>
    </aside>
  {/if}
  <div id="main-content" class="main-content">
    <slot/>
  </div>
</div>