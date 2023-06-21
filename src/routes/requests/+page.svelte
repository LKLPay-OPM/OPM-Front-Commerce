<script>
  /* navigation */
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(async () => {
    await goto("/requests/tickets");
  });
</script>
