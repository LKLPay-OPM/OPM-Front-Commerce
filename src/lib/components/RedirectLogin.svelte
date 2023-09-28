<script>
  import { linkSelected } from "$lib/stores.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  /* components */
  import Loader from "$lib/components/Loader.svelte";

  onMount(async () => {
    $linkSelected = "Login";
    await goto("/login");
  });
</script>

<Loader />
