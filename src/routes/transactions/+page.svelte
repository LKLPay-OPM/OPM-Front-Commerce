<script>
  /* navigation */
  import { goto } from "$app/navigation";

  $: {
    goto("/transactions/day");
  }
</script>
