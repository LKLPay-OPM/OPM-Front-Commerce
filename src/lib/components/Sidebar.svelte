<script>
    import { isLoggedIn, loggedInUser } from '$lib/stores.js'
    import { logout } from '$lib/hooks/auth.js'
    import logo from '$lib/assets/Logo.png';
    import noUser from '$lib/assets/no_user.png';
    import { page } from '$app/stores';
    import { onMount, afterUpdate } from 'svelte';
    import Icons from '$lib/components/Icons.svelte';
  
    /* let loggedInUser = $page.data.loggedInUser;
    let isLoggedIn = $page.data.isLoggedIn; */
  
    // export let sidebar = true;
    let options = [];
  
    const sidebarOptions = () => {
      const optionList = [
        {name: 'Inicio', path: '/home', icon: 'home-outline'},
        {name: 'Mis Ventas', path: '/transactions', icon: 'bank-card-line'},
        {name: 'Cuenta Bancaria', path: '/bank-account', icon: 'bank-line'},
        {name: 'Créditos', path: '/credits', icon: 'bank-line'},
        {name: 'Nueva Venta', path: '/new-sale', icon: 'bank-card-line'},
      ]
      return options = optionList;
    }
  
    afterUpdate(async () => {
      if($isLoggedIn === true){
        sidebarOptions()
      }else{
        options = [];
      }
      });

      let sidebar = true;
  </script>
  
  <div class="sidebar {sidebar ? '' : 'close'}">
    <div class="sidebar-start">
      <div class="logo-details">
        <!-- <i class='bx bxl-c-plus-plus'></i> -->
        <!-- <span class="logo_name">Lkl Pay</span> -->
        <i 
          on:click={() => sidebar = !sidebar}
          on:keydown={() => sidebar = !sidebar}
        >
          <Icons name="menu-lines" width="24" height="24"/>
        </i>
        <a href="/home">
          <img src={logo} alt="Company Logo">
        </a>
      </div>
      <div class="profile-details">
        <div class="profile-content">
          <a href="/profile">
            <img src="{$loggedInUser.avatar ? $loggedInUser.avatar : noUser}" alt="profileImg">
          </a>
        </div>
        <div class="name-job">
          <div class="profile_name">{$loggedInUser?.name} {$loggedInUser?.lastName}</div>
          <div class="job">{$loggedInUser?.businessName ? $loggedInUser?.businessName : ""}</div>
        </div>
        <!-- <i>
          <Icons name="logout-box-line" width="24" height="24"/>
        </i> -->
      </div>
      <ul class="nav-links">
        {#each options as option}
        <li>
          <a href={option.path}>
            <i>
              <Icons name={option.icon} width="24" height="24"/>
            </i>
            <!-- <i class='bx bx-grid-alt'></i> -->
            <span class="link_name">{option.name}</span>
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
        <li>
          <a href="/" on:click={logout}>
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