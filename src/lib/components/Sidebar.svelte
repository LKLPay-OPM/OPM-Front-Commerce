<script>
  import { isLoggedIn, loggedInUser, linkSelected, sidebar } from '$lib/stores.js'
  import { logout } from '$lib/hooks/auth.js'
  import { optionsSidebar } from '$lib/hooks/router.js'
  import logo from '$lib/assets/Logo.png';
  import noUser from '$lib/assets/no_user.png';
  import { page } from '$app/stores';
  import { onMount, afterUpdate } from 'svelte';
  import Icons from '$lib/components/Icons.svelte';

  /* let loggedInUser = $page.data.loggedInUser;
  let isLoggedIn = $page.data.isLoggedIn; */

  // export let sidebar = true;
  let options = [];

  $: {
    if($isLoggedIn){
      optionsSidebar($loggedInUser.accountType)
      .then((response) => {
        options = response;
      })
    }
  }

</script>

<div class="sidebar {$sidebar ? '' : 'close'}">
  <div class="sidebar-start">
    <div class="logo-details">
      <!-- <i class='bx bxl-c-plus-plus'></i> -->
      <!-- <span class="logo_name">Lkl Pay</span> -->
      <i 
        on:click={() => $sidebar = !$sidebar}
        on:keydown={() => $sidebar = !$sidebar}
      >
        <Icons name="menu-lines" width="24" height="24"/>
      </i>
      <a href="/">
        <img src={logo} alt="Company Logo">
      </a>
    </div>
    <a on:click={() => {
        $linkSelected = "Perfil"
      }} 
      on:keypress={(e) => e.key === 'Enter' ? $linkSelected = "Perfil" : $linkSelected = $linkSelected} 
      href="/profile" class="profile-details"
    >
      <div class="profile-content">
        <img src="{$loggedInUser.avatar ? $loggedInUser.avatar : noUser}" alt="profileImg">
      </div>
      <div class="name-job">
        <div class="profile_name">{$loggedInUser?.name || ""} {$loggedInUser?.firstLastName || ""}</div>
        <div class="job">{$loggedInUser?.businessName ? $loggedInUser?.businessName : ""}</div>
      </div>
      <!-- <i>
        <Icons name="logout-box-line" width="24" height="24"/>
      </i> -->
    </a>
    <ul class="nav-links">
      {#each options as option}
      <li 
        on:click={() => {
          $linkSelected = option.name
        }} 
        on:keypress={(e) => e.key === 'Enter' ? $linkSelected = option.name : $linkSelected = $linkSelected} class="{$linkSelected === option.name ? "active-link_name" : ""}">
        <a href={option.path}>
          <i class="{$linkSelected === option.name ? "active-link_name" : ""}">
            <Icons name={option.icon} width="24" height="24"/>
          </i>
          <!-- <i class='bx bx-grid-alt'></i> -->
          <span class="{$linkSelected === option.name ? "active-link_name" : "link_name"}">{option.name}</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href={option.path}>{option.name}</a></li>
        </ul>
      </li>
      {/each}
    </ul>
  </div>
  <div class="sidebar-bottom">
    <ul class="nav-links">
      <li
        on:click={() => {
          $linkSelected = "Ayuda"
        }}
        on:keypress={(e) => e.key === 'Enter' ? $linkSelected = "Perfil" : $linkSelected = $linkSelected}
      >
        <a href="/#help">
          <i class="{$linkSelected === "Ayuda" ? "active-link_name" : ""}">
            <Icons name="help" width="24" height="24"/>
          </i>
          <span class="{$linkSelected === "Ayuda" ? "active-link_name" : "link_name"}">Ayuda</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="/home#help">Ayuda</a></li>
        </ul>
      </li>
      <li>
        <a href="/login" on:click={logout}>
          <i>
            <Icons name="logout-box-line" width="24" height="24"/>
          </i>
          <span class="link_name">Cerrar Sesión</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="/">Cerrar Sesión</a></li>
        </ul>
      </li>
    </ul>
  </div>
</div>
<!-- {#if sidebar}
{/if} -->

<style>

</style>