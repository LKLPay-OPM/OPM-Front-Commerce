<script>
  import {
    isLoggedIn,
    loggedInUser,
    linkSelected,
    appwriteUser,
    sidebar,
  } from "$lib/stores.js";
  // import { logout } from "$lib/hooks/auth.js";
  import { AuthController } from "$lib/controllers/auth/auth.controller";
  import { optionsSidebar } from "$lib/hooks/router.js";
  import logo from "$lib/assets/Logo.png";
  import noUser from "$lib/assets/no_user.png";
  import { page } from "$app/stores";
  import { onMount, afterUpdate } from "svelte";
  import Icons from "$lib/components/Icons.svelte";

  /* let loggedInUser = $page.data.loggedInUser;
  let isLoggedIn = $page.data.isLoggedIn; */

  // export let sidebar = true;
  let options = [];

  // console.log($loggedInUser);
  // console.log($appwriteUser);

  $: {
    if ($isLoggedIn) {
      optionsSidebar($loggedInUser.accountType).then((response) => {
        options = response;
      });
    }
  }
</script>

<div class="navbar">
  <div class="logo-details">
    <i
      on:click={() => ($sidebar = !$sidebar)}
      on:keydown={() => ($sidebar = !$sidebar)}
    >
      <Icons name="menu-lines" width="24" height="24" />
    </i>
  </div>
</div>
<div class="sidebar {$sidebar ? '' : 'close'}">
  <div class="sidebar-start">
    <div class="logo-details">
      <i
        on:click={() => ($sidebar = !$sidebar)}
        on:keydown={() => ($sidebar = !$sidebar)}
      >
        <Icons name="menu-lines" width="24" height="24" />
      </i>
      <a href="/">
        <img src={logo} alt="Company Logo" />
      </a>
    </div>
    <a
      on:click={() => {
        $linkSelected = "Perfil";
      }}
      on:keypress={(e) =>
        e.key === "Enter"
          ? ($linkSelected = "Perfil")
          : ($linkSelected = $linkSelected)}
      href="/profile"
      class="profile-details"
    >
      <div class="profile-content">
        <img src={$loggedInUser?.avatar ?? noUser} alt="profileImg" />
      </div>
      <div class="name-job">
        <div class="profile_name">
          {$appwriteUser?.name ?? ""}
        </div>
        <div class="job">
          {$appwriteUser?.businessName ?? $appwriteUser?.email ?? ""}
        </div>
      </div>
    </a>
    <ul class="nav-links">
      {#each options as option}
        <li
          on:click={() => {
            $linkSelected = option.name;
          }}
          on:keypress={(e) =>
            e.key === "Enter"
              ? ($linkSelected = option.name)
              : ($linkSelected = $linkSelected)}
          class={$linkSelected === option.name ? "active-link_name" : ""}
        >
          <a href={option.path}>
            <i class={$linkSelected === option.name ? "active-link_name" : ""}>
              <Icons name={option.icon} width="24" height="24" />
            </i>
            <!-- <i class='bx bx-grid-alt'></i> -->
            <span
              class={$linkSelected === option.name
                ? "active-link_name"
                : "link_name"}>{option.name}</span
            >
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
          $linkSelected = "Solicitudes";
        }}
        on:keypress={(e) =>
          e.key === "Enter"
            ? ($linkSelected = "Solicitudes")
            : ($linkSelected = $linkSelected)}
      >
        <a href="/requests">
          <i class={$linkSelected === "Solicitudes" ? "active-link_name" : ""}>
            <Icons name="adviser" width="24" height="24" />
          </i>
          <span
            class={$linkSelected === "Solicitudes"
              ? "active-link_name"
              : "link_name"}>Solicitudes</span
          >
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="/requests">Solicitudes</a></li>
        </ul>
      </li>
      <li
        on:click={() => {
          $linkSelected = "Ayuda";
        }}
        on:keypress={(e) =>
          e.key === "Enter"
            ? ($linkSelected = "Ayuda")
            : ($linkSelected = $linkSelected)}
      >
        <a href="/help">
          <i class={$linkSelected === "Ayuda" ? "active-link_name" : ""}>
            <Icons name="help" width="24" height="24" />
          </i>
          <span
            class={$linkSelected === "Ayuda" ? "active-link_name" : "link_name"}
            >Ayuda</span
          >
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="/help">Ayuda</a></li>
        </ul>
      </li>
      <li>
        <a
          href="/login"
          on:click={async () => {
            await AuthController.logout($loggedInUser.$id);
          }}
        >
          <i>
            <Icons name="logout-box-line" width="24" height="24" />
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

<style>
  .navbar {
    overflow: hidden;
    background-color: #f3f3f3;
    position: fixed; /* Set the navbar to fixed position */
    top: 0; /* Position the navbar at the top of the page */
    width: 100%; /* Full width */
    height: 50px;
  }

  .navbar .logo-details {
    display: flex;
    /* padding: 12px 0 12px 0; */
    overflow: hidden;
    align-items: center;
    transition: all 0.4s ease;
  }

  .navbar .logo-details i {
    height: 50px;
    min-width: 4.875rem; /* 78px */
    text-align: center;
    line-height: 60px;
    color: #8b9eb0;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  /* Sidebar */
  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 15rem; /* 240px */
    background: #f3f3f3;
    z-index: 100;
    transition: all 0.5s ease;
  }
  .sidebar .logo-details {
    display: flex;
    /* padding: 12px 0 12px 0; */
    overflow: hidden;
    align-items: center;
    transition: all 0.4s ease;
  }
  .sidebar .logo-details i {
    height: 50px;
    min-width: 4.875rem; /* 78px */
    text-align: center;
    line-height: 60px;
    color: #8b9eb0;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sidebar .logo-details a img {
    height: 1.2rem;
  }
  .sidebar.close .logo-details a img {
    display: none;
  }
  .sidebar-start .nav-links {
    height: 70%;
    /* padding: 30px 0 150px 0; */
    overflow: auto;
  }
  .sidebar-bottom .nav-links {
    height: 100%;
    /* padding: 30px 0 150px 0; */
    overflow: auto;
  }
  .sidebar.close .nav-links {
    overflow: visible;
  }
  .sidebar .nav-links::-webkit-scrollbar {
    display: none;
  }
  .sidebar .nav-links li {
    position: relative;
    list-style: none;
    transition: all 0.4s ease;
  }
  .sidebar .nav-links li:hover {
    background: #113a62;
    color: #8b9eb0;
  }
  .sidebar .active-link_name li:hover {
    color: #8b9eb0;
  }
  .sidebar .nav-links li i {
    height: 3.125rem; /* 50px */
    min-width: 4.875rem; /* 78px */
    text-align: center;
    line-height: 3.75rem; /* 60px */
    color: #8b9eb0;
    font-size: 1.25rem; /* 20px */
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sidebar .nav-links li:hover i {
    height: 3.125rem; /* 50px */
    min-width: 4.875rem; /* 78px */
    text-align: center;
    line-height: 3.125rem; /* 50px */
    color: #8b9eb0;
    font-size: 1.25rem; /* 20px */
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sidebar .nav-links li:hover i.active-link_name {
    height: 3.125rem; /* 50px */
    min-width: 4.875rem; /* 78px */
    text-align: center;
    line-height: 3.125rem; /* 50px */
    color: #8b9eb0;
    font-size: 1.25rem; /* 20px */
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sidebar .nav-links li a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  .sidebar .nav-links li a .link_name {
    font-weight: 700;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.25rem; /* 20px */
    color: #8b9eb0;
    transition: all 0.4s ease;
  }
  .sidebar .nav-links li:hover a .link_name {
    font-weight: 700;
    font-size: 1rem; /* 16px */
    line-height: 1.25rem; /* 20px */
    color: #8b9eb0;
    transition: all 0.4s ease;
  }
  .sidebar .nav-links li a .active-link_name {
    font-weight: 700;
    font-size: 0.8125rem; /* 13px */
    color: #113a62;
    transition: all 0.4s ease;
  }
  .sidebar .nav-links li:hover a .active-link_name {
    font-weight: 700;
    font-size: 1rem; /* 16px */
    color: #8b9eb0;
    transition: all 0.4s ease;
  }
  .sidebar.close .nav-links li a .link_name {
    opacity: 0;
    pointer-events: none;
  }
  .sidebar.close .nav-links li a span.active-link_name {
    opacity: 0;
    pointer-events: none;
  }
  .sidebar .nav-links li .sub-menu {
    font-size: 1rem;
    padding: 6px 6px 14px 80px;
    margin-top: -10px;
    background: #113a62;
    display: none;
  }
  .sidebar .nav-links li.showMenu .sub-menu {
    display: block;
  }
  .sidebar .nav-links li .sub-menu a {
    color: #8b9eb0;
    font-size: 1.125rem; /* 18px */
    padding: 5px 0;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  .sidebar .nav-links li .sub-menu a:hover {
    opacity: 1;
  }
  .sidebar.close .nav-links li .sub-menu {
    position: absolute;
    left: 100%;
    top: -10px;
    margin-top: 0;
    padding: 10px 20px;
    border-radius: 0 6px 6px 0;
    opacity: 0;
    display: block;
    pointer-events: none;
    transition: 0s;
  }
  .sidebar.close .nav-links li:hover .sub-menu {
    top: 0;
    opacity: 1;
    pointer-events: auto;
    transition: all 0.4s ease;
  }
  .sidebar .nav-links li .sub-menu .link_name {
    display: none;
  }
  .sidebar.close .nav-links li .sub-menu .link_name {
    font-weight: 700;
    font-size: 1.125rem; /* 18px */
    opacity: 1;
    display: block;
  }
  .sidebar.close .nav-links li .sub-menu .active-link_name {
    font-weight: 700;
    font-size: 1.125rem; /* 18px */
    opacity: 1;
    display: block;
  }
  .sidebar .nav-links li .sub-menu.blank {
    opacity: 1;
    pointer-events: auto;
    padding: 3px 20px 6px 16px;
    opacity: 0;
    pointer-events: none;
  }
  .sidebar .nav-links li:hover .sub-menu.blank {
    top: 50%;
    transform: translateY(-50%);
  }
  .sidebar .profile-details {
    width: 13.75rem; /* 220px */
    display: flex;
    align-items: center;
    background: #e6e9ef;
    padding: 12px 0;
    transition: all 0.5s ease;
    overflow: hidden;
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 6px;
    text-decoration: none;
    margin: 0.625rem 0.625rem; /* 10rem */
  }
  .sidebar.close .profile-details {
    background: none;
    margin: 0rem 0rem; /* 10rem */
  }
  .sidebar.close .profile-details {
    width: 4.875rem; /* 78px */
  }
  .sidebar .profile-details .profile-content {
    display: flex;
    align-items: center;
  }
  .sidebar .profile-details img {
    height: 52px;
    width: 52px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin: 0 14px 0 12px;
    background: #113a62;
    transition: all 0.5s ease;
  }

  .sidebar .profile-details .profile_name,
  .sidebar .profile-details .job {
    color: #8b9eb0;
    font-weight: 700;
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
    white-space: nowrap;
  }
  .sidebar.close .profile-details i,
  .sidebar.close .profile-details .profile_name,
  .sidebar.close .profile-details .job {
    display: none;
  }
  .sidebar .profile-details .job {
    font-weight: 500;
    font-size: 0.625rem; /* 10px */
    line-height: 1rem; /* 16px */
  }

  @media screen {
    .sidebar {
      width: 15rem; /* 240px */
    }
    .sidebar.close {
      width: 4.875rem; /* 78px */
    }
    .sidebar .profile-details {
      width: 13.75rem; /* 220px */
    }
    .sidebar.close .profile-details {
      background: none;
    }
    .sidebar.close .profile-details {
      width: 4.875rem;
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 15rem; /* 240px */
    }
    .sidebar.close {
      width: 0rem;
    }
    .sidebar .profile-details {
      width: 13.75rem; /* 220px */
    }
    .sidebar.close .profile-details {
      background: none;
    }
    .sidebar.close .profile-details {
      width: 0rem;
    }

    .sidebar.close .nav-links {
      overflow: hidden;
    }
    /* .sidebar {
    display: none;
  } */
  }
</style>
