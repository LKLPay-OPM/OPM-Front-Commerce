<script>
  /* imports */
  import View from "$lib/components/terminals/transactions/week/View.svelte";
  /* exports */
  export let data;
  $: console.log(data);
</script>

<View {data} />
