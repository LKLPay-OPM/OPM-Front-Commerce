<script>
    import { isLoggedIn, loggedInUser } from '$lib/stores.js'
    import { logout } from '$lib/hooks/auth.js'
    import logo from '$lib/assets/LogoH.png';
    import { page } from '$app/stores';
    import { onMount, afterUpdate } from 'svelte';
  
    /* let loggedInUser = $page.data.loggedInUser;
    let isLoggedIn = $page.data.isLoggedIn; */
  
    let options = [];
  
    const sidebarOptions = () => {
      const optionList = [
        {name: 'Inicio', path: '/home'},
        {name: 'Registrar Usuario', path: '/transactions'},
        {name: 'Cuenta Bancaria', path: '/bank-account'},
      ]
      return options = optionList;
    }
  
    afterUpdate(async () => {
      if($isLoggedIn === true){
        await sidebarOptions()
      }else{
        options = [];
      }
      });
  </script>
    
  <div class="sidebar-content z-50">
      <div class="sidebar-start">
        <a href={$isLoggedIn ? "/home" : "/"} class="sidebar-text"><img src={logo} alt="Company Logo" class="sidebar-logo">| LklPay</a>
        <label for="" class="avatar">
           <div class="w-10 rounded-full">
             <img alt="imagen" src="https://api.lorem.space/image/face?hash=33791" />
           </div>
         </label>
        {#each options as option}
          <li><a href={option.path}>{option.name}</a></li>
        {/each}
      </div>
      <div class="sidebar-end">
        <ul class="menu menu-horizontal p-0">
          {#if $isLoggedIn && $loggedInUser}
            <div class="dropdown dropdown-end">
               <ul class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <!-- <li>
                  <a href="/profile" class="justify-between">
                    Profile
                    <span class="badge">New</span>
                  </a>
                </li> -->
                <!-- <li><a href="/settings">Settings</a></li> -->
                <li><a href="/" on:click={logout}>Cerrar Sesión</a></li>
              </ul>
            </div>
            {:else}
            <li><a href="/login">Login</a></li>
          {/if}
        </ul>
      </div>
  </div>
  
  <style>

  </style>