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
  import Tickets from "$lib/components/requests/tickets/Main.svelte";
  let optionSelected = 0;

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;
  const menuComponents = (menu) => {
    const components = {
      0: { component: Tickets },
      1: { component: RollsMenu },
      2: { component: TerminalsMenu },
      4: { component: EditProfile },
    };
    return components[menu].component;
  };

  const menuReturn = () => {
    optionSelected = 0;
  };

  $: {
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="content">
  <div class="container">
    <DateTitle />
    <div class="card-container container">
      <div class={innerWidth <= 540 ? "col" : "col"}>
        <RollsMain bind:optionSelected on:cancel={menuReturn} />
        <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} class:hidden={optionSelected > 0} />
        <TerminalsMain bind:optionSelected />
        <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} class:hidden={optionSelected > 0} />
        <SupportMain bind:optionSelected />
        <div class={innerWidth <= 540 ? "divider-hor" : "divider-hor"} class:hidden={optionSelected > 0} />
        <ProfileMain bind:optionSelected />
      </div>
    </div>
    <svelte:component this={menuComponents(optionSelected)} on:cancel={menuReturn} />
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
