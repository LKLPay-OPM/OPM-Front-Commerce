<script>
    import { isLoggedIn, loggedInUser } from '$lib/stores.js'
    import { logout } from '$lib/hooks/auth.js'
    import logo from '$lib/assets/LogoH.png';
    import { page } from '$app/stores';
    import { onMount, afterUpdate } from 'svelte';
    import Icons from '$lib/components/Icons.svelte';
    import Hamburger from '$lib/components/Hamburger.svelte';
  
    /* let loggedInUser = $page.data.loggedInUser;
    let isLoggedIn = $page.data.isLoggedIn; */
  
    export let sidebar = true;
    let options = [];
  
    const sidebarOptions = () => {
      const optionList = [
        {name: 'Inicio', path: '/home', icon: 'home-outline'},
        {name: 'Transacciones', path: '/transactions', icon: 'bank-card-line'},
        {name: 'Cuenta Bancaria', path: '/bank-account', icon: 'bank-line'},
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
  
  {#if sidebar}
    <div class="sidebar-content">
      <div class="sidebar-start">
          <div class="logo-hamburger">
            <div class="hamburger">
              <Hamburger bind:open={sidebar}/>
            </div>
            <div class="logo">
              <a href="/home" class="sidebar-text"><img src={logo} alt="Company Logo" class="sidebar-logo"></a>
            </div>
          </div>
          <div class="avatar-container">
            <div class="avatar">
              <a href="/profile">
                <img alt="imagen" src="https://api.lorem.space/image/face?hash=33791" />
              </a>
            </div>
          </div>
          {#each options as option}
            <div class="sidebar-item">
              <li><a class="sidebar-item-text" href={option.path}><Icons name={option.icon} width="24" height="24"/> {option.name}</a></li>
            </div>
          {/each}
        </div>
        <div class="sidebar-end">
          <div class="sidebar-item">
            <li><a class="sidebar-item-text" href="/" on:click={logout}><Icons name="logout-box-line" width="24" height="24"/> Cerrar Sesión</a></li>
          </div>
        </div>
    </div>
    {:else}
    <div>
      <div>
        <div class="logo-hamburger">
          <div class="hamburger">
            <Hamburger bind:open={sidebar}/>
          </div>
        </div>
        <div class="avatar-container">
          <div class="avatar">
            
          </div>
        </div>
        {#each options as option}
          <div class="sidebar-item">
            <li><a class="sidebar-item-text" href={option.path}><Icons name={option.icon} width="24" height="24"/></a></li>
          </div>
          {/each}
      </div>
    </div>
  {/if}
  
<style>
/* Sidebar Content Related CSS */
.logo-hamburger {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.logo {
  justify-content: flex-end;
  align-content: center;
}
.hamburger {
  display: flex;
  position: relative;
  width: 100%;
  align-content: center;
  justify-content: flex-start;
}
.sidebar-start {
  height: 90%;
  align-content: flex-start;
}
/* .sidebar-center {
  flex-shrink: 0;
} */
.sidebar-end {
  height: 10%;
  align-content: flex-end;
}

.sidebar-logo {
  height: 2rem; /* 32px */
  margin-left: 1rem; /* 16px */
  margin-right: 1rem; /* 16px */
}

.sidebar-text {
  font-size: 1.25rem; /* 20px */
  line-height: 1.75rem; /* 28px */
  text-transform: none;
  text-decoration: none;
}

.sidebar-content {
  flex-direction: column;
  height: 100%;
  z-index: 50;
}

.sidebar-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  height: 2rem;
  list-style-type:none;
}

.sidebar-item-text {
  text-transform: none;
  text-decoration-line: none;
}

/* Avatar related CSS */
.avatar-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.avatar {
  position: relative;
  display: inline-flex;
  width: 4rem;
  cursor: pointer;
  justify-content: center;
  align-content: center;
}
.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
  justify-content: center;
}

</style>