<script>
  import { loggedInUser } from "$lib/stores";
  import DateTitle from "$lib/components/DateTitle.svelte";
  import EditProfile from "$lib/components/EditProfile.svelte";
  import RollsMain from "$lib/components/requests/rolls/Main.svelte";
  import RollsMenu from "$lib/components/requests/rolls/Menu.svelte";
  import TerminalsMain from "$lib/components/requests/terminals/Main.svelte";
  import TerminalsMenu from "$lib/components/requests/terminals/Menu.svelte";
  import SupportMain from "$lib/components/requests/support/Main.svelte";
  import ProfileMain from "$lib/components/requests/profile/Main.svelte";
  import TicketsMenu from "$lib/components/requests/tickets/Menu.svelte";
  import TicketsMain from "$lib/components/requests/tickets/Main.svelte";

  export let data;
  let user = data?.user;
  let tickets = data?.tickets;
  let optionSelected = 0;

  $: {
    console.log(data);
  }

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;
  const menuComponents = (menu) => {
    const components = {
      0: { component: TicketsMenu },
      1: { component: RollsMenu },
      2: { component: TerminalsMenu },
      4: { component: EditProfile },
    };
    return components[menu].component;
  };

  const menuReturn = () => {
    optionSelected = 0;
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="content">
  <div class="container">
    <div class="row">
      <div class="menu">
        <div class="date">
          <DateTitle />
        </div>
        <div class="card-container container">
          <div class={innerWidth <= 540 ? "col" : "col"}>
            <RollsMain bind:optionSelected on:cancel={menuReturn} />
            <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} />
            <TerminalsMain bind:optionSelected />
            <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} />
            <SupportMain bind:optionSelected />
            <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} />
            <ProfileMain bind:optionSelected />
            <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} />
            <TicketsMain bind:optionSelected />
          </div>
        </div>
      </div>
      <div class="view">
        <svelte:component
          this={menuComponents(optionSelected)}
          {user}
          {tickets}
          bind:optionSelected
          on:cancel={menuReturn}
        />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests/layout.scss";

  .row {
    display: flex;
    position: relative;
    flex-direction: row;
    margin: auto;
    width: 100%;
  }

  .container {
    justify-content: center;
  }

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    .container {
      position: fixed;
      height: fit-content;
    }
    .date {
      position: fixed;
      top: 0;
      margin: 1rem 0;
    }
  }

  .view {
    // width: 100%;
    justify-content: center;
    margin: auto;
  }

  @media (max-width: 540px) {
    .row {
      position: inherit;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .menu {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .container {
        position: inherit;
        height: fit-content;
      }
      .date {
        position: inherit;
        // top: 0;
        margin: 1rem 0;
      }
    }
  }
</style>
