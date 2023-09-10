<script>
  /* imports */
  import View from "$lib/components/terminals/transactions/month/View.svelte";
  /* exports */
  export let data;
  $: console.log(data);
</script>

<View {data} />
