<script>
  import { isLoggedIn, loggedInUser } from "$lib/stores.js";
  import { logout } from "$lib/hooks/auth.js";
  import logo from "$lib/assets/LogoH.png";
  import { page } from "$app/stores";
  import { onMount, afterUpdate } from "svelte";

  /* let loggedInUser = $page.data.loggedInUser;
  let isLoggedIn = $page.data.isLoggedIn; */

  let options = [];

  const navbarOptions = (type) => {
    const rol = {
      adminsu: [
        { name: "Registrar Usuario", path: "/register" },
        //{name: 'Ventas', path: '/sales'},
      ],
      admin: [
        { name: "Registrar Usuario", path: "/register" },
        //{name: 'Ventas', path: '/sales'}
      ],
      cashier: [
        { name: "Opción 1", path: "/home" },
        { name: "Registrar Usuario", path: "/register" },
      ],
      operator: [
        { name: "Opción 1", path: "/home" },
        { name: "Registrar Usuario", path: "/register" },
      ],
    };
    return (options = rol[type]);
  };

  afterUpdate(async () => {
    if ($isLoggedIn === true && $loggedInUser.role) {
      const userRole = $loggedInUser.role;
      //console.log({userRole})
      await navbarOptions(userRole);
    } else {
      options = [];
    }
  });
</script>

<div class="navbar bg-base-100 noPrint z-50">
  <div class="navbar-start">
    <a href={$isLoggedIn ? "/home" : "/"} class="btn btn-ghost navbarText"
      ><img src={logo} alt="Company Logo" class="navbarLogo" />| LklPay</a
    >
  </div>
  <div class="navbar-end">
    <ul class="menu menu-horizontal p-0">
      {#if $isLoggedIn && $loggedInUser}
        {#each options as option}
          <li><a href={option.path}>{option.name}</a></li>
        {/each}
        <div class="dropdown dropdown-end">
          <label for="" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img
                alt="imagen"
                src="https://api.lorem.space/image/face?hash=33791"
              />
            </div>
          </label>
          <ul
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <!-- <li>
                <a href="/profile" class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li> -->
            <!-- <li><a href="/settings">Settings</a></li> -->
            <li><a href="/" on:click={logout}>Logout</a></li>
          </ul>
        </div>
      {:else}
        <li><a href="/login">Login</a></li>
      {/if}
    </ul>
  </div>
</div>

<style>
  @media print {
    .noPrint {
      visibility: hidden;
    }
  }
</style>
