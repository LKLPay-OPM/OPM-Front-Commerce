<script>
  /* components */
  import TicketsMenu from "$lib/components/requests/tickets/Menu.svelte";

  export let data;
  let tickets = data?.tickets;

  $: {
    console.log(data);
  }
</script>

<TicketsMenu {tickets} />

<style lang="scss">
</style>
