<script>
  /* imports */
  import View from "$lib/components/transactions/day/Table.svelte";
  /* exports */
  export let data;
  $: console.log(data);
</script>

<View {data} />
